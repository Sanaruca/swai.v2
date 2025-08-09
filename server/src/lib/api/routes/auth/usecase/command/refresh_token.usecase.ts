import { auth_procedure } from '../../../../procedures';
import * as jwt from 'jsonwebtoken';
import { obtener_usuario_fn } from '../../../usuarios/usecase/query/obtener_usuario.usecase';
import { UsuarioDTO } from '@swai/core';
import type { PrismaClient } from '@prisma/client';
import type * as express from 'express';

export const refresh_token = auth_procedure.mutation<{
  token: string;
  data: UsuarioDTO;
}>(async ({ ctx }) =>
  refresh_token_fn({
    cedula: ctx.sesssion.usuario.cedula,
    secret: ctx.env.secret,
    deps: { prisma: ctx.prisma, response: ctx.server.response },
  }),
);

export interface RefreshTokenFnParams {
  secret: string;
  cedula: number;
  deps: {
    prisma: PrismaClient;
    response: express.Response;
  };
}

export async function refresh_token_fn({
  secret,
  cedula,
  deps,
}: RefreshTokenFnParams): Promise<{ token: string; data: UsuarioDTO }> {
  const response = await generate_token_fn({
    secret: secret,
    cedula: cedula,
    deps: { prisma: deps.prisma },
  });

  deps.response.cookie('swai.auth', response.token, {
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24, // 1 dia
  });

  return response;
}

export interface GenerateTokenFnParams {
  secret: string;
  cedula: number;
  deps: {
    prisma: PrismaClient;
  };
}

export async function generate_token_fn({
  secret,
  cedula,
  deps,
}: GenerateTokenFnParams): Promise<{ token: string; data: UsuarioDTO }> {
  const usuario = await obtener_usuario_fn({
    cedula,
    deps,
  });

  const token = jwt.sign(usuario, secret, {
    expiresIn: '1d',
  });

  return { token, data: usuario };
}
