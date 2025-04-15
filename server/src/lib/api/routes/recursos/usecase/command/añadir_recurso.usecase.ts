import type { PrismaClient } from '@prisma/client';
import {
  RecursoDeUnEspacioAcademico,
  RecursoDeUnEspacioAcademicoSchema,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures/admin.procedure';
import { InferOutput, omit, parser } from 'valibot';

export const AñadirRecursoSchemaDTO = omit(RecursoDeUnEspacioAcademicoSchema, [
  'id',
]);

export type AñadirRecursoDTO = InferOutput<typeof AñadirRecursoSchemaDTO>;

export const añadir_recurso_fn = async ({
  deps,
  params,
}: {
  params: AñadirRecursoDTO;
  deps: { prisma: PrismaClient };
}) => {
  const recurso_del_espacio =
    await deps.prisma.recursos_de_un_espacio_academico.findFirst({
      where: {
        recurso: params.recurso,
        espacio_academico: params.espacio_academico,
        estado: params.estado,
      },
    });

  if (recurso_del_espacio) {
    return await deps.prisma.recursos_de_un_espacio_academico.update({
      where: {
        id: recurso_del_espacio.id,
      },
      data: {
        cantidad: {
          increment: params.cantidad,
        },
      },
    });
  }

  return await deps.prisma.recursos_de_un_espacio_academico.create({
    data: params,
  });
};

export const añadir_recurso = admin_procedure
  .input(parser(AñadirRecursoSchemaDTO))
  .mutation<RecursoDeUnEspacioAcademico>(({ input, ctx }) =>
    añadir_recurso_fn({ params: input, deps: { prisma: ctx.prisma } })
  );
