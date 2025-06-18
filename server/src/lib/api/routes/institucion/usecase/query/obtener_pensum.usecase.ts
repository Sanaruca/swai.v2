import { PensumDTO, NIVEL_ACADEMICO, PensumSchemaDTO, NivelAcademicoSchema, SwaiError, SwaiErrorCode } from '@swai/core';
import { public_procedure } from '../../../../procedures';
import { InferOutput, object, optional, parse, parser } from 'valibot';
import type { PrismaClient } from '@prisma/client';

export const ObtenerPensumSchemaDTO = object({
  nivel_academico: NivelAcademicoSchema.entries.numero
})

export type ObtenerPensumDTO = InferOutput<typeof ObtenerPensumSchemaDTO>

export const obtener_pensum = public_procedure.input(parser(optional(ObtenerPensumSchemaDTO))).query<PensumDTO[] | PensumDTO>(
  async ({ ctx, input }) => obtener_pensum_fn({ params: input, deps: { prisma: ctx.prisma } })
);

export interface ObtenerPensumFnParams {
  params?: ObtenerPensumDTO
  deps: {
    prisma: PrismaClient
  }
}

export async function obtener_pensum_fn({params, deps}: ObtenerPensumFnParams) : Promise<PensumDTO[] | PensumDTO> {
  
    const niveles_academicos = await deps.prisma.niveles_academicos.findMany({
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

    if (params) {
      const data = pensum.find((it) => it.nivel_academico.numero === params.nivel_academico);
      if (!data) throw new SwaiError({ codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO, mensaje: 'Pensum no encontrado' });
      return data
    }
    
    return pensum

  
}