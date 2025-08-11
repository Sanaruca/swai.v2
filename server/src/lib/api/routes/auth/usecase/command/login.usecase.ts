import { SwaiError, SwaiErrorCode, UsuarioDTO } from '@swai/core';
import { InferOutput, object, parser, pipe, string, trim } from 'valibot';
import { public_procedure } from '../../../../procedures';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { obtener_usuario_fn } from '../../../usuarios/usecase/query/obtener_usuario.usecase';

export const LoginSchemaDTO = object({
  usuario: pipe(string(), trim()),
  clave: pipe(string(), trim()),
});

export type LoginDTO = InferOutput<typeof LoginSchemaDTO>;

export const login = public_procedure
  .input(parser(LoginSchemaDTO))
  .mutation<UsuarioDTO>(async ({ ctx, input }) => {
    const usuario = await ctx.prisma.usuarios.findUnique({
      where: { nombre_de_usuario: input.usuario },
      select: {
        cedula: true,
        clave: true,
      },
    });

    if (!usuario) {
      throw new SwaiError({
        codigo: SwaiErrorCode.AUTENTICACION_CREDENCIALES_INVALIDAS,
        mensaje: 'Usuario o clave incorrectos',
      });
    }

    if (!(await bcrypt.compare(input.clave, usuario.clave))) {
      throw new SwaiError({
        codigo: SwaiErrorCode.AUTENTICACION_CREDENCIALES_INVALIDAS,
        mensaje: 'Usuario o clave incorrectos',
      });
    }

    const usuario_dto = await obtener_usuario_fn({
      cedula: usuario.cedula,
      deps: {
        prisma: ctx.prisma,
      },
    });

    const token = jwt.sign(usuario_dto, ctx.env.secret, {
      expiresIn: '1d',
    });

    ctx.server.response.cookie('swai.auth', token, {
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24, // 1 dia
    });
    return usuario_dto;
  });
