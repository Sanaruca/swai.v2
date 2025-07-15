# Etapa de build: instalar dependencias, generar prisma y preparar la app
FROM oven/bun:1.2-alpine AS build

WORKDIR /app

# Copiar archivos necesarios para instalar dependencias y prisma
COPY package.json .
COPY prisma/schema.prisma .

# Instalar dependencias (sin guardar en package.json)
RUN bun i -p --no-save --ignore-scripts

# Generar cliente Prisma
RUN bunx prisma generate

RUN bunx nx build api

# Cambiar permisos (opcional, según tu necesidad)
RUN addgroup --system api && adduser --system -G api api
RUN chown -R api:api .

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

EXPOSE ${PORT}

WORKDIR /app

# Crear usuario para seguridad
RUN addgroup --system api && adduser --system -G api api

# Copiar desde la etapa build solo los archivos necesarios
COPY --from=build /app/api ./api
COPY --from=build /app/package.json .
COPY --from=build /app/schema.prisma .

RUN bun i -p --no-save --ignore-scripts
RUN bunx prisma generate

# Cambiar propietario de los archivos
RUN chown -R api:api .

USER api

CMD [ "bun", "api/main.js" ]
