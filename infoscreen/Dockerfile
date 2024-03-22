# Wähle das Node.js Image mit einer bestimmten Version
FROM node:14

# Setze das Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Kopiere die package.json und package-lock.json (falls vorhanden)
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere deine Anwendungsquellen
COPY . .

# Baue die Anwendung
RUN npm run build

# Der Nginx-Server dient als Hosting-Server für die statischen Dateien
FROM nginx:alpine

# Kopiere die erstellten Dateien von der vorherigen Phase in den Nginx-Container
COPY --from=0 /usr/src/app/dist /usr/share/nginx/html

# Exponiere den Port 80
EXPOSE 80

# Starte den Nginx-Server
CMD ["nginx", "-g", "daemon off;"]
