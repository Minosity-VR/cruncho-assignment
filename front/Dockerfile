## Stage 0, "build": based on Node.js, to build and compile the frontend
FROM node:16-alpine as build

WORKDIR /app

# Separate npm install and npm build to make the best from Docker cache
COPY package.json /app/package.json
RUN npm install

COPY . /app/

RUN npm run build

## Stage 1: based on the official nginx image, serves the static frontend files
FROM nginx:1.21

# Build-time args
ARG front_files

# Copy front files
COPY --from=build /app/build ${front_files}