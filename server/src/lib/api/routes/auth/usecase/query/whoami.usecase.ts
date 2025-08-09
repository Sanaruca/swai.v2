import { UsuarioDTO } from '@swai/core';
import { auth_procedure } from '../../../../procedures';
import { boolean, object, optional, InferOutput } from 'valibot';
import { obtener_usuario_fn } from '../../../usuarios/usecase/query/obtener_usuario.usecase';

export const WhoAmISchemaDTO = object({
  fetch: optional(boolean(), false),
});

export type WhoAmIDTO = InferOutput<typeof WhoAmISchemaDTO>;

export const whoami = auth_procedure
  .input(optional(WhoAmISchemaDTO, { fetch: false }))
  .query<UsuarioDTO>(async ({ ctx, input }) => {
    if (input.fetch) {
      const usuario = await obtener_usuario_fn({
        cedula: ctx.sesssion.usuario.cedula,
        deps: {
          prisma: ctx.prisma,
        },
      });

      return usuario;
    }

    return ctx.sesssion.usuario;
  });
