import { array, object, optional, parser } from 'valibot';
import { admin_procedure } from '../../../../procedures';
import {
    CedulaSchema,
    ESTADO_ACADEMICO,
    NIVELES_ACADEMICOS_MAP,
    SeccionSchema,
} from '@swai/core';
import { actualizar_estudiante_fn } from '../../../estudiantes';

export const PromoverEstudiantesSchemaDTO = object({
  nivel_academico: SeccionSchema.entries.nivel_academico,
  estudiantes: optional(array(CedulaSchema)),
});

export const promover_estudiantes = admin_procedure
  .input(parser(PromoverEstudiantesSchemaDTO))
  .mutation(async ({ ctx, input }) => {
    const estudiantes = await ctx.prisma.estudiantes.findMany({
      where: {
        nivel_academico: input.nivel_academico,
        estado_academico: ESTADO_ACADEMICO.ACTIVO,
        cedula: {
          in: input.estudiantes,
        },
      },
      select: {
        cedula: true,
      },
    });

    const target = NIVELES_ACADEMICOS_MAP[input.nivel_academico + 1].numero;

    Promise.all(
      estudiantes.map((estudiante) =>
        actualizar_estudiante_fn({
          params: {
            estudiante: estudiante.cedula,
            actualizacion: {
              nivel_academico: target,
              estado_academico: ESTADO_ACADEMICO.ACTIVO,
              materias_pendientes: null,
            },
          },
          deps: {
            prisma: ctx.prisma,
          },
        })
      )
    );
  });
