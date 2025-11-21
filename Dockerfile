FROM node:20.19-alpine

# Carpeta de trabajo estándar
WORKDIR /usr/src/app

# Solo package.json / lock para aprovechar la cache
COPY package*.json ./

# Instalar dependencias (idealmente con lockfile)
RUN npm ci --omit=dev || npm install --omit=dev

# Copiar el resto del código
COPY . .

# Compilar TypeScript a dist/
RUN npm run build

# Exponer el puerto donde realmente escucha la app
EXPOSE 3001

# Usar el script start que ya tienes definido
CMD ["npm", "run", "start"]
