import {
  EspacioAcademico,
  EspacioAcademicoSchema,
  TIPO_DE_ESPACIO_ACADEMICO,
} from '@swai/core';
import { public_procedure } from '../../../../procedures';
import { array, parse } from 'valibot';

export const obtener_salones_de_clase = public_procedure.query<
  EspacioAcademico[]
>(async ({ ctx }) => {
  const espacios_academicos = await ctx.prisma.espacios_academicos.findMany({
    where: { tipo: TIPO_DE_ESPACIO_ACADEMICO.SALON_DE_CLASES },
  });

  return parse(array(EspacioAcademicoSchema), espacios_academicos);
});
