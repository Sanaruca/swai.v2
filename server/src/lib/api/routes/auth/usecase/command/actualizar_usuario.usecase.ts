import {
  boolean,
  InferOutput,
  object,
  omit,
  optional,
  parser,
  partial,
} from 'valibot';
import { auth_procedure } from '../../../../procedures';
import {
  SwaiError,
  SwaiErrorCode,
  UsuarioDTO,
  UsuarioSchemaDTO,
} from '@swai/core';
import { obtener_usuario_fn } from '../../../usuarios/usecase/query/obtener_usuario.usecase';
import { refresh_token_fn } from './refresh_token.usecase';

export const ActualizarUsuarioSchemaDTO = object({
  refresh_token: optional(boolean(), false),
  actualizacion: partial(
    omit(UsuarioSchemaDTO, ['sexo', 'cedula', 'id', 'rol']),
  ),
});

export type ActualizarUsuarioDTO = InferOutput<
  typeof ActualizarUsuarioSchemaDTO
>;

export const actualizar_usuario = auth_procedure
  .input(parser(ActualizarUsuarioSchemaDTO))
  .mutation<
    UsuarioDTO | { token: string; data: UsuarioDTO }
  >(async ({ ctx, input }) => {
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

    await ctx.prisma.$transaction([
      ctx.prisma.usuarios.update({
        where: {
          id: ctx.sesssion.usuario.id,
        },
        data: {
          nombre_de_usuario: input.actualizacion.nombre_de_usuario || undefined,
        },
      }),
      ctx.prisma.personas.update({
        where: {
          cedula: ctx.sesssion.usuario.cedula,
        },
        data: {
          nombres: input.actualizacion.nombres || undefined,
          apellidos: input.actualizacion.apellidos || undefined,
          correo: input.actualizacion.correo || undefined,
          direccion: input.actualizacion.direccion || undefined,
          telefono: input.actualizacion.telefono || undefined,
        },
      }),
    ]);

    if (input.refresh_token) {
      return refresh_token_fn({
        cedula: ctx.sesssion.usuario.cedula,
        secret: ctx.env.secret,
        deps: {
          prisma: ctx.prisma,
          response: ctx.server.response,
        },
      });
    }

    const usuario_dto = await obtener_usuario_fn({
      cedula: usuario.cedula,
      deps: { prisma: ctx.prisma },
    });

    return usuario_dto;
  });
