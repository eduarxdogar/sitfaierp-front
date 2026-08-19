# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar configuración de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del proyecto
COPY . .

# Construir aplicación
RUN pnpm run build

# Stage 2: Serve
FROM nginx:alpine

# Copiar configuración custom de nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos generados
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
