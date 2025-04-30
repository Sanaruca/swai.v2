import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type * as express from 'express';
// eslint-disable-next-line @nx/enforce-module-boundaries
import type { PrismaClient } from '@prisma/client';
import { UsuarioPayload, UsuarioPayloadSchema } from '@swai/core';
import { parse } from 'valibot';
import type { KeyObject } from 'crypto';

export interface TRPCContext {
  prisma: PrismaClient;
  sesssion: {
    usuario: UsuarioPayload | null;
  };
  server: {
    request: express.Request;
    response: express.Response;
  };
  env: {
    paseto_local_key: KeyObject;
  };
}

export const createExpressTRPCContext: (options: {
  dependencies: {
    prisma: PrismaClient;
  };
  env: {
    paseto_local_key: KeyObject;
  };
}) => (options: CreateExpressContextOptions) => TRPCContext =
  ({ dependencies, env }) =>
  ({ req, res }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const usuario = req['user']
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
      ? parse(UsuarioPayloadSchema, req['user'])
      : null;

    return {
      prisma: dependencies.prisma,
      sesssion: {
        usuario,
      },
      server: {
        request: req,
        response: res,
      },
      env,
    };
  };
