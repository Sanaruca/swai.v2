import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { ROOT_ROUTER, createExpressTRPCContext } from '@swai/server';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import morgan from 'morgan';
import { V3 } from 'paseto';
import cookieParser from 'cookie-parser';
const { decrypt, generateKey } = V3;

import { UsuarioPayloadSchema } from '@swai/core';
import { parse } from 'valibot';
import type { KeyObject } from 'crypto';

let paseto_local_key: KeyObject;
generateKey('local').then((k) => (paseto_local_key = k));

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT || 3000;
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['info', 'warn', 'error']
      : ['error'],
});

const app = express();
// app.set('trust proxy', true)
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.NX_CORS_ORIGIN || 'http://localhost:4200',
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

app.use(async (req, res, next) => {
  console.log('Request Headers:', req.headers); // Log the request headers
  try {
    const token =
      req.headers.authorization?.split(' ')[1] || req.cookies?.['swai.auth'];

    if (token) {
      const payload = await decrypt(token, paseto_local_key);
      const usuario = parse(UsuarioPayloadSchema, payload);
      req.user = usuario;
    }
  } catch (error) {
    console.error('Error al verificar el token:', error);
  }

  next();
});

/* .................................. trpc .................................. */

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({
    router: ROOT_ROUTER,
    createContext: (params) => {
      return createExpressTRPCContext({
        dependencies: {
          prisma,
        },
        env: {
          paseto_local_key: paseto_local_key,
        },
      })(params);
    },
    onError: ({ error }) => {
      console.error('Error in trpc middleware:', error);
    },
  })
);

app.listen(Number(port), host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
