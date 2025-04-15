import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
// eslint-disable-next-line @nx/enforce-module-boundaries
import type { PrismaClient } from '@prisma/client';
import { UsuarioPayload, UsuarioPayloadSchema } from '@swai/core';
import { parse } from 'valibot';

export interface TRPCContext {
  prisma: PrismaClient;
  sesssion: {
    usuario: UsuarioPayload | null;
  };
}

export const createExpressTRPCContext: (options: {
  dependencies: {
    prisma: PrismaClient;
  };
}) => (options: CreateExpressContextOptions) => TRPCContext =
  ({ dependencies }) =>
  ({ req }) => {
    // @ts-ignore
    const usuario = req['user']
      ? // @ts-ignore
        parse(UsuarioPayloadSchema, req['user'])
      : null;

    return {
      prisma: dependencies.prisma,
      sesssion: {
        usuario,
      },
    };
  };
