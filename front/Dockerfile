# Ce fichier va dans le répertoire api de okanban
FROM node:lts-alpine3.22

# ? Ce répertoire se trouve dans le conteneur
WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./
#COPY ./package* ./

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm","run","dev"]