import { PensumDTO, NIVEL_ACADEMICO, PensumSchemaDTO, NivelAcademicoSchema, SwaiError, SwaiErrorCode } from '@swai/core';
import { public_procedure } from '../../../../procedures';
import { object, optional, parse, parser } from 'valibot';

export const ObtenerPensumSchemaDTO = object({
  nivel_academico: NivelAcademicoSchema.entries.numero
})

export const obtener_pensum = public_procedure.input(parser(optional(ObtenerPensumSchemaDTO))).query<PensumDTO[] | PensumDTO>(
  async ({ ctx, input }) => {
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

    const pensum = niveles_academicos.map((nivel_academico) =>
      parse(PensumSchemaDTO, {
        nivel_academico,
        areas_de_formacion: nivel_academico.pensum.map((pensum) => ({
          ...pensum.areas_de_formacion,
          horas: pensum.horas,
        })),
      })
    );

    if (input) {
      const data = pensum.find((it) => it.nivel_academico.numero === input.nivel_academico);
      if (!data) throw new SwaiError({ codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO, mensaje: 'Pensum no encontrado' });
      return data
    }
    
    return pensum

  }
);
