# 1. Utiliser l'image officielle Node.js comme base
FROM node:18-alpine

# 2. Définir le répertoire de travail dans le conteneur
WORKDIR /app

# 3. Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# 4. Installer les dépendances
RUN npm install

# 5. Copier tout le reste du code de l'application
COPY . .

# 6. Exposer le port sur lequel l'API Express écoute (5000 dans server.js)
EXPOSE 5000

# 7. Commande pour démarrer l'application (le serveur Express)
CMD ["node", "server.js"]