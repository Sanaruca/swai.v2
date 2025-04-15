import { TipoDeEspacioAcademicoSchema } from '@swai/core';
import { public_procedure } from '../../../../procedures';
import { object, number, array, InferOutput, parse } from 'valibot';

const CantidadDeEspaciosAcademicosSchemaDTO = object({
  total: number(),
  espacios_academicos: array(
    object({
      total: number(),
      tipo: TipoDeEspacioAcademicoSchema,
    })
  ),
});

export type CantidadDeEspaciosAcademicosDTO = InferOutput<
  typeof CantidadDeEspaciosAcademicosSchemaDTO
>;

export const obtener_cantidad_de_espacios_academicos =
  public_procedure.query<CantidadDeEspaciosAcademicosDTO>(async ({ ctx }) => {
    const tipos_de_espacios =
      await ctx.prisma.tipos_de_espacio_academico.findMany({
        include: {
          _count: { select: { espacios_academicos: true } },
        },
      });

    const total = tipos_de_espacios.reduce(
      (acc, it) => acc + it._count.espacios_academicos,
      0
    );

    return parse(CantidadDeEspaciosAcademicosSchemaDTO, {
      total,
      espacios_academicos: tipos_de_espacios.map((it) => ({
        total: it._count.espacios_academicos,
        tipo: it,
      })),
    });
  });
