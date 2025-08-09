import {
  SwaiError,
  SwaiErrorCode,
  UsuarioDTO,
  UsuarioSchemaDTO,
} from '@swai/core';
import {
  InferOutput,
  object,
  parse,
  parser,
  pipe,
  string,
  trim,
} from 'valibot';
import { public_procedure } from '../../../../procedures';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

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
        id: true,
        nombre_de_usuario: true,
        cedula: true,
        rol: true,
        clave: true,
        personas: {
          select: {
            nombres: true,
            apellidos: true,
            correo: true,
            direccion: true,
            sexo: true,
            telefono: true,

            estados_civiles: true,
          },
        },
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

    const usuarioDTO: UsuarioDTO = parse(UsuarioSchemaDTO, {
      id: usuario.id,
      nombre_de_usuario: usuario.nombre_de_usuario,
      cedula: usuario.cedula,
      rol: usuario.rol,
      ...usuario.personas,
      estado_civil: usuario.personas.estados_civiles,
    });

    const token = jwt.sign(usuarioDTO, ctx.env.secret, {
      expiresIn: '1d',
    });

    ctx.server.response.cookie('swai.auth', token, {
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24, // 1 dia
    });
    return usuarioDTO;
  });
