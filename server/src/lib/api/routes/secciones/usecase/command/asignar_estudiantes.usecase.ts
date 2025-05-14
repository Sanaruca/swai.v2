import { array, InferOutput, object, parser } from 'valibot';
import { admin_procedure } from '../../../../procedures/admin.procedure';
import {
    CedulaSchema,
    NIVEL_ACADEMICO,
    SeccionSchema,
    SwaiError,
    SwaiErrorCode,
} from '@swai/core';

export const AsignarEstudiantesSchemaDTO = object({
  estudiantes: array(CedulaSchema),
  seccion: SeccionSchema.entries.id,
});

export type AsignarEstudiantesDTO = InferOutput<
  typeof AsignarEstudiantesSchemaDTO
>;

export const asignar_estudiantes = admin_procedure
  .input(parser(AsignarEstudiantesSchemaDTO))
  .mutation(async ({ ctx, input }) => {

    const seccion =  
      await ctx.prisma.secciones.findFirst({
        where: {
          id: input.seccion,
        },
      })

    if (!seccion) {
      throw new SwaiError({
        codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
        mensaje: 'Seccion no encontrada',
      });
    }

    await ctx.prisma.estudiantes.updateMany({
      where: {
        cedula: {
          in: input.estudiantes,
        },
        nivel_academico: {
            not: NIVEL_ACADEMICO.Egresado,
        },
      },
      data: {
        seccion: seccion.id,
        nivel_academico: seccion.nivel_academico,
      },
    });




  });
