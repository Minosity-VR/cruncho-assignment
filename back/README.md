# Backend

This backend replies to the frontend request on `/api/restaurants` by using Google Places API.\
The used framework is NestJS.\
All the feature done here (exactly one) could have been done in the frontend, but:
- I wanted to use both HERE API and Google Cloud API to test them
- I do not care if the HERE API key appears in the frontend file, as it is a free account with no facturation
- I do care for the Google API key, because even if it is a free account, there still is a limitaion on number of requests.
- I wanted to try NestJS
\
So here we are with a backend :)
## Repo
```bash
.
├── Dockerfile                    # To build the docker image, see below
├── README.md
├── node_modules/                 # All modules used (gitignored)
├── nest-cli.json                 # Vars for nest commands (build, start...)
├── package-lock.json
├── package.json                  # List of node_modules and npm scripts
├── src
│   ├── api
│   │   ├── api.controller.ts     # Define API routes (here only one: /api/restaurants)
│   │   ├── api.dto.ts            # Check incomming requests query parameters
│   │   └── api.service.ts        # Functions handling requests
│   ├── app.module.ts             # Import env vars, define controllers and services
│   ├── main.ts                   # Main APP. Launches the backend
│   └── misc
│       ├── axiosRequest.ts       # Wrapper for axios requests
│       ├── distanceCompute.ts    # Compute Crow-flight distance between two points (Haversine Formula)
│       └── types.ts              # Custom types (mainly to define Google API response objects)
├── test                          # Tests. Created by "nest new" command. Didn't have time to complete sorry
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json                 # TS config file. Created by "nest new" command.
```

## Google Places API
Use this API to retrieve points of interest near a location. For now (29/11/2021), only restaurants can be retrieved.

## Dockerfile
There are two stages in the docker file to take advantage of docker cache managment, and end up with a relatively small image.\
In the first stage, we install the __development__ dependencies and use the `npm run build` command to create a compact and optimized NestJS APP.\
In the second stage, we copy the builded file. We must re-install the dependencies, bust this time only the __production__ ones. Then we launch the server, on the port defined in the `.env` file.

## Env vars & file
The `.env` file defined here is used both in local development (running `npm run start`), and in production as it is loaded by the `env_file` field of the docker-compose. You can use something like `.env.development` and `.env.production` if you prefer, but you may need to change some parameters when you launch commands.\
The `.env` file should look like this:
```env
BACK_PORT=Number
SEARCH_RADIUS=NumberInMetters
GOOGLE_PLACES_API_KEY=areallylongandcomplicatedstringthatyoumustkeepsecret

```

## The APP itself
When a request hit the backend on the route `/api/restaurant`, it is catched by the api.controller, checked to make sure it contains localisation informations, then the function inside api.service is called.\
This function calls the Google Places API using a `nearbysearch`, which returns a lot of information. Only some fields are returned to the user (name, location, rate, distance from user).

## License

Nest is [MIT licensed](LICENSE).
