import { EspacioAcademicoDTO, EspacioAcademicoSchemaDTO } from '@swai/core';
import { public_procedure } from '../../../../procedures';
import {
  PaginationParamsSchema,
  Paginated,
  PaginationParams,
} from '../../../../../schemas';
import { object, optional, InferOutput, parser, parse } from 'valibot';

export const ObtenerEspaciosAcademicosSchemaDTO = object({
  paginacion: optional(PaginationParamsSchema),
});

export type ObtenerEspaciosAcademicosDTO = InferOutput<
  typeof ObtenerEspaciosAcademicosSchemaDTO
>;

export const obtener_espacios_academicos = public_procedure
  .input(parser(optional(ObtenerEspaciosAcademicosSchemaDTO)))
  .query<Paginated<EspacioAcademicoDTO>>(async ({ ctx, input }) => {
    const paginacion = parse(
      PaginationParamsSchema,
      input?.paginacion ?? {}
    ) as Required<PaginationParams>;

    const [espacios_academicos, total] = await ctx.prisma.$transaction([
      ctx.prisma.espacios_academicos.findMany({
        skip: (paginacion.page - 1) * paginacion.limit, // Saltar los resultados de las páginas anteriores
        take: paginacion.limit, // Tomar el número de resultados especificado
        include: {
          tipos_de_espacio_academico: true,
          recursos_de_un_espacio_academico: {
            include: {
              recursos: true,
              estados_de_un_recurso: true,
            },
          },
        },
      }),
      ctx.prisma.espacios_academicos.count(),
    ]);
    // Calcular el total de páginas
    const pages = Math.ceil(total / paginacion.limit);

    const data = espacios_academicos.map((espacio_academico) =>
      parse(EspacioAcademicoSchemaDTO, {
        ...espacio_academico,
        tipo: espacio_academico.tipos_de_espacio_academico,
        recursos: espacio_academico.recursos_de_un_espacio_academico.map(
          (it) => ({
            ...it,
            recurso: it.recursos,
            estado: it.estados_de_un_recurso,
          })
        ),
      })
    );

    return {
      ...paginacion,
      data,
      pages,
      total,
    };
  });
