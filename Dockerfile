# Étape 1 : Build Astro avec Node.js
FROM node:lts AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Étape 2 : Serveur Nginx pour site statique
FROM webdevops/nginx:alpine

# Copie de la config Nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Copie les fichiers statiques dans /app/dist
COPY --from=build /app/dist /app/dist
