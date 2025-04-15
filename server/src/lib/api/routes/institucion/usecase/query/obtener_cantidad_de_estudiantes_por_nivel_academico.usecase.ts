import {
    NivelAcademicoSchema,
    SeccionSchema,
    ESTADO_ACADEMICO,
    SwaiError,
    SwaiErrorCode,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import { } from 'path';
import { object, number, array, InferOutput, parser, parse } from 'valibot';

export const CantidadDeEstudiantesPorNivelAcademicoSchemaDTO = object({
  ...NivelAcademicoSchema.entries,
  total: number(),
  activos: number(),
  no_inscritos: number(),
  secciones: array(
    object({
      ...SeccionSchema.entries,
      total: number(),
    })
  ),
});

export type CantidadDeEstudiantesPorNivelAcademicoDTO = InferOutput<
  typeof CantidadDeEstudiantesPorNivelAcademicoSchemaDTO
>;

export const obtener_cantidad_de_estudiantes_por_nivel_academico =
  admin_procedure
    .input(parser(NivelAcademicoSchema.entries.numero))
    .query<CantidadDeEstudiantesPorNivelAcademicoDTO>(
      async ({ ctx, input }) => {
        const [estudiantes_activos, estudiantes_no_inscritos, nivel_academico] =
          await ctx.prisma.$transaction([
            ctx.prisma.estudiantes.count({
              where: {
                nivel_academico: input,
                estado_academico: ESTADO_ACADEMICO.ACTIVO,
              },
            }),
            ctx.prisma.estudiantes.count({
              where: {
                nivel_academico: input,
                estado_academico: ESTADO_ACADEMICO.NO_INSCRITO,
              },
            }),
            ctx.prisma.niveles_academicos.findUnique({
              where: {
                numero: input,
              },
              include: {
                secciones: {
                  orderBy: {
                    seccion: 'asc',
                  },
                  include: {
                    _count: {
                      select: {
                        estudiantes: {
                          where: { estado_academico: ESTADO_ACADEMICO.ACTIVO },
                        },
                      },
                    },
                  },
                },
              },
            }),
          ]);

        if (!nivel_academico)
          throw new SwaiError({
            codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
            mensaje: 'Nivel academico no existe',
          });

        return parse(CantidadDeEstudiantesPorNivelAcademicoSchemaDTO, {
          ...nivel_academico,
          total: estudiantes_activos + estudiantes_no_inscritos,
          activos: estudiantes_activos,
          no_inscritos: estudiantes_no_inscritos,
          secciones: nivel_academico.secciones.map((seccion) => ({
            ...seccion,
            total: seccion._count.estudiantes,
          })),
        });
      }
    );
