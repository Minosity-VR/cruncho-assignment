## Stage 0, "build": based on Node official image, to build the NestJS backend
FROM node:16-alpine as build

WORKDIR /usr/src/app

# Separate npm install and copy of back files to use cache if no package update
COPY package*.json ./
RUN npm install --only=development

# Copy files to build Nest API
COPY . .
RUN npm run build

## Stage 1: based on the official nginx image, serves the static frontend files
FROM node:16-alpine as production

WORKDIR /usr/src/app

# Copy and install only the modules, as the components files are built
COPY package*.json ./
RUN npm install --only=production

# Retrieve built project from build stage
COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
