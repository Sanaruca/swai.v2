import {
  EspacioAcademicoSchema,
  SwaiError,
  SwaiErrorCode,
  ESTADOS_DE_UN_RECURSO,
  EstadoDeUnRecursoSchema,
  RecursoSchema,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import {
  variant,
  object,
  optional,
  string,
  InferOutput,
  parser,
  array,
  number,
} from 'valibot';

export const ObtenerRecursosDeUnEspacioAcademicoSchemaDTO = variant('id', [
  object({
    id: EspacioAcademicoSchema.entries.id,
    slug: optional(string()),
  }),
  object({
    id: optional(EspacioAcademicoSchema.entries.id),
    slug: string(),
  }),
]);

export type ObtenerRecursosDeUnEspacioAcademicoDTO = InferOutput<
  typeof ObtenerRecursosDeUnEspacioAcademicoSchemaDTO
>;

export const RecursosDeUnEspacioAcademicoSchemaDTO = object({
  recursos: array(
    object({
      ...RecursoSchema.entries,
      estados: array(
        object({
          ...EstadoDeUnRecursoSchema.entries,
          porcentaje: number(),
          total: number(),
        })
      ),
      total: number(),
    })
  ),
  total: number(),
});

export type RecursosDeUnEspacioAcademicoDTO = InferOutput<
  typeof RecursosDeUnEspacioAcademicoSchemaDTO
>;

export const obtener_recursos_de_un_espacio_academico = admin_procedure
  .input(parser(ObtenerRecursosDeUnEspacioAcademicoSchemaDTO))
  .query<RecursosDeUnEspacioAcademicoDTO>(async ({ ctx, input }) => {
    const espacio_academico = await ctx.prisma.espacios_academicos.findFirst({
      where: {
        OR: [
          {
            id: input.id,
          },
          {
            metadata: {
              path: ['slug'],
              equals: input.slug,
            },
          },
        ],
      },
    });

    if (!espacio_academico)
      throw new SwaiError({
        codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
        mensaje: 'Espacio academico no existe',
      });

    const recursos = await ctx.prisma.recursos.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        recursos_de_un_espacio_academico: {
          where: {
            espacio_academico: espacio_academico.id,
          },
        },
      },
    });

    const data = recursos.reduce(
      (data, it) => {
        const recurso = {
          id: it.id,
          nombre: it.nombre,
          estados: ESTADOS_DE_UN_RECURSO.map((it) => ({
            ...it,
            porcentaje: 0,
            total: 0,
          })),
          total: 0,
        };

        for (const recurso_del_espacio of it.recursos_de_un_espacio_academico) {
          recurso.estados[recurso_del_espacio.estado - 1].total +=
            recurso_del_espacio.cantidad;
          recurso.total += recurso_del_espacio.cantidad;
          data.total += recurso_del_espacio.cantidad;
        }

        recurso.estados = recurso.estados.map((it) => ({
          ...it,
          porcentaje:
            parseFloat(((it.total / recurso.total) * 100).toFixed(2)) || 0,
        }));

        data.recursos.push(recurso);

        return data;
      },
      {
        recursos: [],
        total: 0,
      } as RecursosDeUnEspacioAcademicoDTO
    );

    return data;
  });
