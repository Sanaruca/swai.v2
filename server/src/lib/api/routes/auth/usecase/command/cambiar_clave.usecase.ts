import { object, parser } from 'valibot';
import { auth_procedure } from '../../../../procedures';
import { SwaiError, SwaiErrorCode, UsuarioSchema } from '@swai/core';
import * as bcrypt from 'bcryptjs';

export const CambiarClaveSchemaDTO = object({
  clave: UsuarioSchema.entries.clave,
  nueva_clave: UsuarioSchema.entries.clave,
  confirmar_nueva_clave: UsuarioSchema.entries.clave,
});

export const cambiar_clave = auth_procedure
  .input(parser(CambiarClaveSchemaDTO))
  .mutation(async ({ ctx, input }) => {
    const usuario = await ctx.prisma.usuarios.findFirst({
      where: {
        id: ctx.sesssion.usuario.id,
      },
    });

    if (!usuario)
      throw new SwaiError({
        codigo: SwaiErrorCode.AUTENTICACION_USUARIO_NO_AUTENTICADO,
        mensaje: 'Usuario no se a autenticado',
      });

    const clave_valida = await bcrypt.compare(input.clave, usuario.clave);

    if (!clave_valida)
      throw new SwaiError({
        codigo: SwaiErrorCode.AUTENTICACION_CREDENCIALES_INVALIDAS,
        mensaje: 'Clave invalida',
        descripcion: 'La clave actual es incorrecta',
      });

    if (input.nueva_clave !== input.confirmar_nueva_clave)
      throw new SwaiError({
        codigo: SwaiErrorCode.VALIDACION,
        mensaje: 'Las contraseñas no coinciden',
        descripcion: 'Verifique que las contraseñas sean iguales',
      });

    const clave_encriptada = bcrypt.hashSync(input.nueva_clave, 10);

    await ctx.prisma.usuarios.update({
      where: {
        id: ctx.sesssion.usuario.id,
      },
      data: {
        clave: clave_encriptada,
      },
    });
  });
