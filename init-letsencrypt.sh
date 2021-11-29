#!/bin/bash

# Because of the potential use of a "sed" command to fill the nginx conf templates,
# we first need to determine the user's OS
case "$(uname -s)" in
  Darwin)
    machine='Mac'
    ;;

  Linux)
    machine='Linux'
    ;;

  CYGWIN*|MINGW32*|MSYS*|MINGW*)
    echo "Windows not handled"
    exit
    ;;

  *)
    echo "Only Mac and Linux are handled"
    exit 
    ;;
esac


if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

if ! [ -f .env ]
then
  echo 'Error: no .env file found.' >&2
  exit 1
fi
export $(cat .env | sed 's/#.*//g' | xargs)

rsa_key_size=4096
data_path="./docker-data/certbot"
nginx_path="./docker-data/nginx-conf"

# Values from env
domains=($DOMAIN)
email=$CERTBOT_EMAIL # Adding a valid address is strongly recommended
front_files=$FRONT_FILES
back_port=$BACK_PORT

staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits

count_nginx_conf=`ls -1 $nginx_path/*.conf 2>/dev/null | wc -l`
if [ $count_nginx_conf == 0 ]; then
  read -p "There is no nginx .conf file in $nginx_path. Do you want to generate one based on the template ? (y/N)" decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    echo "No Nginx conf file. Please populate $nginx_path with at least one"
    exit
  else
    template_files=`find $nginx_path -maxdepth 1 -type f -name "*.template"`
    for template_file in $template_files; do
      destination_filename=$(basename -- "$template_file")
      destination_conf="${destination_filename%.*}"
      cp $nginx_path/*.template $nginx_path/$destination_conf
      if [ $machine == 'Mac' ]; then
        sed -i "" "s|{{ domain }}|$DOMAIN|g" $nginx_path/$destination_conf
        sed -i "" "s|{{ path/to/front/files }}|$front_files|g" $nginx_path/$destination_conf
        sed -i "" "s|{{ backend-port }}|$back_port|g" $nginx_path/$destination_conf
      elif [ $machine == 'Linux' ]; then
        sed -i "s|{{ domain }}|$DOMAIN|g" $nginx_path/$destination_conf
        sed -i "s|{{ path/to/front/files }}|$front_files|g" $nginx_path/$destination_conf
        sed -i "s|{{ backend-port }}|$back_port|g" $nginx_path/$destination_conf
      else
        echo "Cannot run sed. How did you get there ?"
        exit
      fi
    done
  fi
fi

if [ -d "$data_path" ]; then
  read -p "Existing data found for $domains. Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi

if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi

echo "### Creating dummy certificate for $domains ..."
path="/etc/letsencrypt/live/$domains"
mkdir -p "$data_path/conf/live/$domains"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo

# We start nginx (which also starts the backend because the front has a 'depend_on' field),
# because of the reverse proxy nginx start fails if backend is missing
echo "### Starting nginx ..."
docker-compose up --build --force-recreate -d nginx-and-front
echo

echo "### Deleting dummy certificate for $domains ..."
docker-compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domains && \
  rm -Rf /etc/letsencrypt/archive/$domains && \
  rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot
echo


echo "### Requesting Let's Encrypt certificate for $domains ..."
#Join $domains to -d args
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --no-eff-email \
    --force-renewal" certbot
echo

echo "### Reloading nginx ..."
docker-compose up -d --force-recreate
