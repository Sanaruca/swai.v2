import {
  PlantelEducativo,
  PlantelEducativoSchema,
  SwaiError,
  SwaiErrorCode,
} from '@swai/core';
import { public_procedure } from '../../../../procedures';
import { parser } from 'valibot';

export const obtener_plantel_educativo = public_procedure
  .input(parser(PlantelEducativoSchema.entries.dea))
  .query<PlantelEducativo>(async ({ ctx, input }) => {
    const plantel = await ctx.prisma.planteles_educativos.findUnique({
      where: { dea: input },
    });

    if (!plantel)
      throw new SwaiError({
        codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
        mensaje: 'Plantel educativo no encontrado',
        descripcion: 'Verifique el código DEA proporcionado',
      });

    return plantel;
  });
