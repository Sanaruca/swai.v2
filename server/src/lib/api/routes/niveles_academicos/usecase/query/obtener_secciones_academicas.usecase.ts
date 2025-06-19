import { object, optional, parser, partial, parse } from 'valibot';
import { public_procedure } from './../../../../procedures';
import { SeccionDTO, SeccionSchema, SeccionSchemaDTO } from '@swai/core';
import {
    Paginated,
    PaginationParamsSchema,
    PaginationParams,
} from '../../../../../schemas';

export const ObtenerSeccionesAcademicasSchemaDTO = object({
  nivel_academico: SeccionSchema.entries.nivel_academico,
  paginacion: optional(partial(PaginationParamsSchema)),
});

export const obtener_secciones_academicas = public_procedure
  .input(parser(ObtenerSeccionesAcademicasSchemaDTO))
  .query<Paginated<SeccionDTO>>(async ({ ctx, input }) => {
    const paginacion = parse(
      PaginationParamsSchema,
      input?.paginacion ?? {}
    ) as Required<PaginationParams>;

    const [secciones, total] = await Promise.all([
      ctx.prisma.secciones.findMany({
        skip: (paginacion.page - 1) * paginacion.limit, // Saltar los resultados de las páginas anteriores
        take: paginacion.limit, // Tomar el número de resultados especificado

        where: {
          nivel_academico: input.nivel_academico,
        },
        select: {
            id: true,
            nivel_academico: true,
            seccion: true,
          profesores: {
            select: {
              titulo_de_pregrado: true,
              especialidad: true,
              plantel_de_dependencia: true,
              personas: {
                select: {
                  cedula: true,
                  nombres: true,
                  apellidos: true,
                },
              },
            },
          },
        },
      }),
      ctx.prisma.secciones.count({
        where: {
          nivel_academico: input.nivel_academico,
        },
      }),
    ]);

        // Calcular el total de páginas
    const pages = Math.ceil(total / paginacion.limit);

    const data = secciones.map((seccion) => parse(SeccionSchemaDTO, {
        ...seccion,
        profesor_guia: seccion.profesores ? {
          ...seccion.profesores.personas,
          ...seccion.profesores,
        } : null,
    }))

    return {
      ...paginacion,
      data,
      pages,
      total,
    };

  });
