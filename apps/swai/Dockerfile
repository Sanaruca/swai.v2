# Etapa de build: instalar dependencias, generar prisma y preparar la app
FROM node:22.17-alpine3.22 AS build

ARG SWAI_BASE_URL=http://localhost:4000

ENV SWAI_BASE_URL=$SWAI_BASE_URL

RUN apk add --no-cache curl bash
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.2.18"

ENV PATH="/root/.bun/bin:$PATH"

WORKDIR /app

COPY package.json bun.lockb* .
RUN bun install --no-save --ignore-scripts
COPY . .

RUN bun prisma generate
RUN bun nx build swai

# --------------------------------------------------------

# Etapa de producción
FROM oven/bun:1.2-alpine AS runner

ARG PORT=4000


ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=${PORT}


WORKDIR /app

# Crea usuario de forma concisa
RUN addgroup --system swai \
 && adduser --system -G swai swai

# Copia solo lo esencial, con permisos
COPY --from=build /app/dist/apps/swai    . 
COPY --from=build /app/package.json      .
COPY --from=build /app/bun.lockb*        .
COPY --from=build /app/prisma/schema.prisma .

# Instala solo deps de producción
RUN bun install --production --ignore-scripts

# Genera cliente Prisma en tiempo de ejecución
RUN bunx prisma generate

USER swai

RUN ls

EXPOSE ${PORT}
CMD ["bun", "server/server.mjs"]
