# Dockerfile para Eventia Core API (NestJS)
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Install ALL dependencies (including devDependencies) so tests can run inside the container
RUN npm install

COPY . ./
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
