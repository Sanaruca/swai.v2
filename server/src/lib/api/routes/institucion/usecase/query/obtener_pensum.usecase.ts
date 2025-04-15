import { PensumDTO, NIVEL_ACADEMICO, PensumSchemaDTO } from '@swai/core';
import { public_procedure } from '../../../../procedures';
import { parse } from 'valibot';

export const obtener_pensum = public_procedure.query<PensumDTO[]>(
  async ({ ctx }) => {
    const niveles_academicos = await ctx.prisma.niveles_academicos.findMany({
      where: {
        numero: { lt: NIVEL_ACADEMICO.Egresado },
      },
      orderBy: {
        numero: 'asc',
      },
      include: {
        pensum: {
          include: {
            areas_de_formacion: true,
          },
        },
      },
    });

    return niveles_academicos.map((nivel_academico) =>
      parse(PensumSchemaDTO, {
        nivel_academico,
        areas_de_formacion: nivel_academico.pensum.map((pensum) => ({
          ...pensum.areas_de_formacion,
          horas: pensum.horas,
        })),
      })
    );
  }
);
