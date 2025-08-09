import type { PrismaClient } from '@prisma/client';
import {
  SwaiError,
  SwaiErrorCode,
  UsuarioDTO,
  UsuarioSchemaDTO,
} from '@swai/core';
import { parse } from 'valibot';

export interface ObtenerUsuarioFnParams {
  cedula: number;
  deps: {
    prisma: PrismaClient;
  };
}
export async function obtener_usuario_fn({
  deps,
  cedula,
}: ObtenerUsuarioFnParams): Promise<UsuarioDTO> {
  const usuario = await deps.prisma.usuarios.findFirst({
    where: {
      cedula: cedula,
    },
    select: {
      id: true,
      nombre_de_usuario: true,
      rol: true,

      personas: {
        select: {
          cedula: true,
          nombres: true,
          apellidos: true,
          correo: true,
          direccion: true,
          sexo: true,
          telefono: true,
        },
      },
    },
  });

  if (!usuario)
    throw new SwaiError({
      codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
      mensaje: 'Usuario no encontrado',
      descripcion:
        'El usuario con la cedula proporcionada no se encuentra registrado',
    });

  const usuario_dto = parse(UsuarioSchemaDTO, {
    ...usuario,
    ...usuario.personas,
  });

  return usuario_dto;
}
