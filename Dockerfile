FROM node:14.16.0-alpine

LABEL autor1="Mauricio Duran"
LABEL autor2="Edgar Medina"

WORKDIR /usr/src

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "bin/bash" ]