import { SwaiError, SwaiErrorCode, UsuarioPayload } from '@swai/core';
import { InferOutput, object, parser, pipe, string, trim } from 'valibot';
import { public_procedure } from '../../../../procedures';
import {V3} from 'paseto';
const {encrypt} = V3;

export const LoginSchemaDTO = object({
  usuario: pipe(string(), trim()),
  clave: pipe(string(), trim()),
});

export type LoginDTO = InferOutput<typeof LoginSchemaDTO>;

export const login = public_procedure
  .input(parser(LoginSchemaDTO))
  .mutation<UsuarioPayload>(async ({ ctx, input }) => {

    const usuario = await ctx.prisma.usuarios.findUnique({
      where: { nombre_de_usuario: input.usuario, clave: input.clave },
      select: {
        id: true,
        nombre_de_usuario: true,
        cedula: true,
        rol: true,
      },
    })

    if (!usuario) {
      throw new SwaiError({
        codigo: SwaiErrorCode.AUTENTICACION_CREDENCIALES_INVALIDAS,
        mensaje: 'Usuario o clave incorrectos',
      });
    }

    const usuarioPayload: UsuarioPayload = {
      id: usuario.id,
      nombre_de_usuario: usuario.nombre_de_usuario,
      cedula: usuario.cedula,
      rol: usuario.rol,
    };

    const token =  await encrypt(usuarioPayload, ctx.env.paseto_local_key, {
      expiresIn: '1d'
    })

    ctx.server.response.cookie('swai.auth', token)
    return usuarioPayload

  });
