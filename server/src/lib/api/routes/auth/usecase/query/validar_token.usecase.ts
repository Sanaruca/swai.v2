import { parser, string } from 'valibot';
import { public_procedure } from '../../../../procedures';
import * as jwt from 'jsonwebtoken';
import { SwaiError, SwaiErrorCode } from '@swai/core';

export const validar_token = public_procedure
  .input(parser(string()))
  .query<any>(({ input, ctx }) => validar_token_fn(input, ctx.env.secret));

export function validar_token_fn(token: string, secret: string): any {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new SwaiError({
      codigo: SwaiErrorCode.VALIDACION,
      mensaje: 'Error al validar token',
    });
  }
}
