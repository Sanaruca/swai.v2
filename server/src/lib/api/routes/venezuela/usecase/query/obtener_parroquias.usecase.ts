import { MunicipioSchema, Parroquia } from '@swai/core';
import { public_procedure } from '../../../../procedures';
import { object, optional, InferInput, parser } from 'valibot';

const ObtenerParroquiasSchemaDTO = object({
  por_municipio: optional(MunicipioSchema.entries.codigo),
});

export type ObtenerParroquiasDTO = InferInput<
  typeof ObtenerParroquiasSchemaDTO
>;

export const obtener_parroquias = public_procedure
  .input(parser(optional(ObtenerParroquiasSchemaDTO)))
  .query<Parroquia[]>(({ ctx, input }) =>
    ctx.prisma.parroquias.findMany({
      where: {
        codigo_municipio: input?.por_municipio,
      },
    })
  );
