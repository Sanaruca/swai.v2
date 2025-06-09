import { NivelAcademicoSchema, SeccionSchema } from '@swai/core';
import { public_procedure } from '../../../../procedures';
import { intersect, object, array, InferOutput, parse } from 'valibot';

export const NivelAcademicoConSeccionesSchema = intersect([
  NivelAcademicoSchema,
  object({
    secciones: array(SeccionSchema),
  }),
]);

export type NivelAcademicoConSeccionesDTO = InferOutput<
  typeof NivelAcademicoConSeccionesSchema
>;

export const obtener_niveles_academicos = public_procedure.query<
  Array<NivelAcademicoConSeccionesDTO>
>(async ({ ctx }) => {
  // throw new Error('mostro');

  const niveles_academicos = await ctx.prisma.niveles_academicos.findMany({
    where: {
      numero: { lt: 6 },
    },
    include: {
      secciones: true,
    },
  });

  return niveles_academicos.map(({ secciones, ...it }) =>
    parse(NivelAcademicoConSeccionesSchema, {
      ...it,
      secciones,
    })
  );
});
