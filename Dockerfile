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

# Etapa de producción
FROM nginx:alpine

# Copiar la construcción desde la etapa anterior
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 9000
EXPOSE 9000

# Comando para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]
