import type { PrismaClient } from '@prisma/client';
import { SwaiError, SwaiErrorCode, Usuario } from '@swai/core';
import * as bcrypt from 'bcryptjs';

export interface CambiarClaveDeUsuarioFnParams {
  params: {
    usuario: Usuario['id'];
    nueva_clave: string;
  };
  deps: {
    prisma: PrismaClient;
  };
}

export async function cambiar_clave_de_usuario_fn({
  params,
  deps,
}: CambiarClaveDeUsuarioFnParams) {
  const usuario = await deps.prisma.usuarios.findUnique({
    where: { id: params.usuario },
    select: { id: true },
  });

  if (!usuario)
    throw new SwaiError({
      codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
      mensaje: 'Usuario no encontrado',
      descripcion:
        'El usuario con el id proporcionado no se encuentra registrado',
    });

  const hash = bcrypt.hashSync(params.nueva_clave, 15);

  await deps.prisma.usuarios.update({
    where: { id: usuario.id },
    data: {
      clave: hash,
    },
  });
}
