import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type * as express from 'express';
// eslint-disable-next-line @nx/enforce-module-boundaries
import type { PrismaClient } from '@prisma/client';
import { UsuarioDTO, UsuarioSchemaDTO } from '@swai/core';
import { parse } from 'valibot';
export interface TRPCContext {
  prisma: PrismaClient;
  sesssion: {
    usuario: UsuarioDTO | null;
  };
  server: {
    request: express.Request;
    response: express.Response;
  };
  env: {
    secret: string;
  };
}

export const createExpressTRPCContext: (options: {
  dependencies: {
    prisma: PrismaClient;
  };
  env: {
    secret: string;
  };
}) => (options: CreateExpressContextOptions) => TRPCContext =
  ({ dependencies, env }) =>
  ({ req, res }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const usuario = req['user']
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
      ? parse(UsuarioSchemaDTO, req['user'])
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
