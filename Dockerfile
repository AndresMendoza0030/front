# Etapa de construcción
FROM node:18-alpine AS build

# Crear y moverse al directorio de trabajo
WORKDIR /app

# Copiar los archivos del proyecto al contenedor
COPY . .

# Instalar las dependencias
RUN npm install --omit=dev

# Construir la aplicación
RUN npm run build




# Exponer el puerto 9000
EXPOSE 9000

