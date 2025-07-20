# Etapa de build: instalar dependencias, generar prisma y preparar la app
FROM node:22.17-alpine3.22 AS build


# Instalar curl y bash para descargar Bun
RUN apk add --no-cache curl bash

# Descargar e instalar Bun (versión fija para reproducibilidad)
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.2.18"


# Añadir Bun al PATH
ENV PATH="/root/.bun/bin:$PATH"

WORKDIR /app

# Copiar archivos necesarios para instalar dependencias y prisma
COPY . .



# Instalar dependencias (sin guardar en package.json)
RUN bun i --no-save --ignore-scripts

# Generar cliente Prisma
RUN bun prisma generate


RUN bun nx build api


# --------------------------------------------------------

# Etapa final: imagen limpia con solo lo necesario para correr la app
FROM oven/bun:1.2-alpine

ARG PORT=3000
ARG HOST=0.0.0.0
ARG DATABASE_URL=0.0.0.0
ARG CORS_ORIGIN=0.0.0.0

ENV HOST=$HOST
ENV PORT=$PORT
ENV DATABASE_URL=$DATABASE_URL
ENV CORS_ORIGIN=$CORS_ORIGIN

WORKDIR /app


# Copiar desde la etapa build solo los archivos necesarios
COPY --from=build /app/dist/api ./api
COPY --from=build /app/package.json .
COPY --from=build /app/prisma/schema.prisma .

RUN bun i -p --no-save --ignore-scripts
RUN bunx prisma generate

# Cambiar permisos (opcional, según tu necesidad)
RUN addgroup --system api && adduser --system -G api api
# Cambiar propietario de los archivos
RUN chown -R api:api .

USER api

EXPOSE ${PORT}
CMD [ "bun", "api/main.js" ]
