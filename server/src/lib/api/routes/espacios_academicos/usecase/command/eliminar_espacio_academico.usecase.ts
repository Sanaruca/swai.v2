import { EspacioAcademicoSchema } from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import { parser } from 'valibot';

export const eliminar_espacio_academico = admin_procedure
  .input(parser(EspacioAcademicoSchema.entries.id))
  .mutation(async ({ ctx, input }) => {
    return await ctx.prisma.espacios_academicos.delete({
      where: { id: input },
    });
  });
