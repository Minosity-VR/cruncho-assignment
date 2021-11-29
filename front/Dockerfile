## Stage 0, "build": based on Node.js, to build and compile the frontend
FROM node:16-alpine as build

WORKDIR /app

# Separate npm install and npm build to make the best from Docker cache
COPY package.json /app/package.json
RUN npm install

# The .env is not copied to the Docker image to prevent leaking a secret
COPY . /app/
# So we need to define ARG vars, that are available only at build-time
ARG REACT_APP_HERE_API_KEY
ARG REACT_APP_BACK_API_URL

RUN npm run build

## Stage 1: based on the official nginx image, serves the static frontend files
FROM nginx:1.21

# Build-time args
ARG front_files

# Copy front files
COPY --from=build /app/build ${front_files}