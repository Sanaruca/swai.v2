import { object, parser, string } from 'valibot';
import { public_procedure } from '../../../../procedures';
import { SwaiError, SwaiErrorCode, UsuarioSchema } from '@swai/core';
import { validar_token_fn } from '../../../auth/usecase/query/validar_token.usecase';
import { cambiar_clave_de_usuario_fn } from './cambiar_clave_de_usuario.usecase';

export const RestablecerClaveSchemaDTO = object({
  token: string(),
  nueva_clave: UsuarioSchema.entries.clave,
  confirmar_nueva_clave: UsuarioSchema.entries.clave,
});

export const restablecer_clave = public_procedure
  .input(parser(RestablecerClaveSchemaDTO))
  .mutation(async ({ input, ctx }) => {
    const { usuario_id } = validar_token_fn(input.token, ctx.env.secret);

    if (input.nueva_clave !== input.confirmar_nueva_clave) {
      throw new SwaiError({
        codigo: SwaiErrorCode.VALIDACION,
        mensaje: 'Las contraseñas no coinciden',
        descripcion: 'Verifique que las contraseñas sean iguales',
      });
    }

    await cambiar_clave_de_usuario_fn({
      params: {
        usuario: usuario_id,
        nueva_clave: input.nueva_clave,
      },
      deps: {
        prisma: ctx.prisma,
      },
    });
  });
