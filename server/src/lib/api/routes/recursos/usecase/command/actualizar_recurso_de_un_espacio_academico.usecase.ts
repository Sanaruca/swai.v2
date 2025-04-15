import {
  RecursoDeUnEspacioAcademico,
  RecursoDeUnEspacioAcademicoSchema,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import { omit, parser } from 'valibot';
import { añadir_recurso_fn } from './añadir_recurso.usecase';

export const ActualizarRecursoDeUnEspacioAcademicoSchema = omit(
  RecursoDeUnEspacioAcademicoSchema,
  ['id']
);

export const actualizar_recurso_de_un_espacio_academico = admin_procedure
  .input(parser(ActualizarRecursoDeUnEspacioAcademicoSchema))
  .mutation<RecursoDeUnEspacioAcademico>(async ({ ctx, input, signal }) => {
    const recurso_del_espacio =
      await ctx.prisma.recursos_de_un_espacio_academico.findFirst({
        where: {
          recurso: input.recurso,
          estado: input.estado,
          espacio_academico: input.espacio_academico,
        },
      });

    if (!recurso_del_espacio) {
      return await añadir_recurso_fn({
        params: input,
        deps: { prisma: ctx.prisma },
      });
    }

    // Si el recurso existe, actualizamos la cantidad y el estado
    return await ctx.prisma.recursos_de_un_espacio_academico.update({
      where: {
        id: recurso_del_espacio.id,
      },
      data: {
        cantidad: input.cantidad, // Actualiza la cantidad directamente
        estado: input.estado, // Actualiza el estado si es necesario
      },
    });
  });
