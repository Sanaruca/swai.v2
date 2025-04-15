import { ParroquiaSchema, CentroDeVotacion } from '@swai/core';
import { public_procedure } from '../../../../procedures';
import { object, optional, InferInput, parser } from 'valibot';

export const ObtenerCentrosDeVotacionSchemaDTO = object({
  por_parroquia: optional(ParroquiaSchema.entries.codigo),
});

export type ObtenerCentrosDeVotacionDTO = InferInput<
  typeof ObtenerCentrosDeVotacionSchemaDTO
>;

export const obtener_centros_de_votacion = public_procedure
  .input(parser(optional(ObtenerCentrosDeVotacionSchemaDTO)))
  .query<CentroDeVotacion[]>(({ ctx, input }) =>
    ctx.prisma.centros_de_votacion.findMany({
      where: {
        codigo_parroquia: input?.por_parroquia,
      },
    })
  );
