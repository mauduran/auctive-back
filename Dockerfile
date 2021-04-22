FROM node:14.16.0-alpine

LABEL autor1="Mauricio Duran"
LABEL autor2="Edgar Medina"
ARG PORT=3000

WORKDIR /usr/src

COPY package*.json ./

RUN npm install

EXPOSE 3000

COPY . .

ENTRYPOINT [ "npm", "start" ]