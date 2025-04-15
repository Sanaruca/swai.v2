import {
  EspacioAcademicoSchema,
  EspacioAcademicoSchemaDTO,
  SwaiError,
  SwaiErrorCode,
  EspacioAcademicoDTO,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import {
  variant,
  object,
  optional,
  string,
  InferOutput,
  parser,
  parse,
} from 'valibot';

export const ObtenerEspacioAcademicoSchemaDTO = variant('id', [
  object({
    id: EspacioAcademicoSchema.entries.id,
    slug: optional(string()),
  }),
  object({
    id: optional(EspacioAcademicoSchema.entries.id),
    slug: string(),
  }),
]);

export type ObtenerEspacioAcademicoDTO = InferOutput<
  typeof ObtenerEspacioAcademicoSchemaDTO
>;

export const obtener_espacio_academico = admin_procedure
  .input(parser(ObtenerEspacioAcademicoSchemaDTO))
  .query<EspacioAcademicoDTO>(async ({ ctx, input }) => {
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
      include: {
        tipos_de_espacio_academico: true,
        recursos_de_un_espacio_academico: {
          include: {
            recursos: true,
            estados_de_un_recurso: true,
          },
        },
      },
    });

    if (!espacio_academico)
      throw new SwaiError({
        codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
        mensaje: 'Espacio academico no encontrado',
      });

    return parse(EspacioAcademicoSchemaDTO, {
      ...espacio_academico,
      tipo: espacio_academico.tipos_de_espacio_academico,
      recursos: espacio_academico.recursos_de_un_espacio_academico.map(
        (it) => ({
          ...it,
          recurso: it.recursos,
          estado: it.estados_de_un_recurso,
        })
      ),
    });
  });
