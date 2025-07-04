# Ce fichier va dans le répertoire api de okanban
FROM node:lts-alpine3.22

# ? Ce répertoire se trouve dans le conteneur
WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./
#COPY ./package* ./

RUN npm i

RUN chown -R node /usr/src/app/node_modules
# ? Le premier . est le contexte de l'hôte
# ? Le second . est le WORKDIR du conteneur
COPY . .

EXPOSE 5000

# Lance le serveur — adapte si ton script diffère
CMD ["npm", "run", "dev"]