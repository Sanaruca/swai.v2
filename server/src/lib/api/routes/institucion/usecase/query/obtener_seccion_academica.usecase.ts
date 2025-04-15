import {
  SeccionDTO,
  SeccionSchemaDTO,
  SwaiError,
  SwaiErrorCode,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import { InferOutput, number, object, parse, parser, string } from 'valibot';

export const ObtenerSeccionAcademicaSchemaDTO = object({
  nivel_academico: number(),
  seccion: string(),
});

export type ObtenerSeccionAcademicaDTO = InferOutput<
  typeof ObtenerSeccionAcademicaSchemaDTO
>;

export const obtener_seccion_academica = admin_procedure
  .input(parser(ObtenerSeccionAcademicaSchemaDTO))
  .query<SeccionDTO>(async ({ input, ctx }) => {
    const seccion = await ctx.prisma.secciones.findFirst({
      where: {
        nivel_academico: input.nivel_academico,
        seccion: input.seccion,
      },
      include: {
        profesores: {
          include: {
            personas: true,
          },
        },
      },
    });

    if (!seccion)
      throw new SwaiError({
        codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
        mensaje: 'Seccion académica no existe',
      });

    const profesor_guia = seccion.profesor_guia && {
      ...seccion.profesores?.personas,
      ...seccion.profesores,
    };

    return parse(SeccionSchemaDTO, {
      ...seccion,
      profesor_guia,
    });
  });
