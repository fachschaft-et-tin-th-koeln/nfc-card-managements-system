# Wähle das Node.js Image
FROM node:14

# Erstelle das Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Kopiere die package.json und package-lock.json (falls vorhanden)
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Wenn du in der Produktionsumgebung bist
# RUN npm ci --only=production

# Kopiere deine Anwendungsquellen
COPY . .

# Deine Anwendung bindet an Port 3001, stelle sicher, dass der Port verfügbar ist
EXPOSE 3001

# Definiere den Befehl zum Starten deiner Anwendung
CMD [ "node", "index.js" ]
