import { EstadosDeVenezuelaISO, Municipio } from '@swai/core';
import { public_procedure } from '../../../../procedures';
import { object, optional, enum_, InferInput } from 'valibot';

const ObtenerMunicipiosSchemaDTO = object({
  por_estado: optional(enum_(EstadosDeVenezuelaISO)),
});

export type ObtenerMunicipiosDTO = InferInput<
  typeof ObtenerMunicipiosSchemaDTO
>;

// TODO: paginar resultados
export const obtener_municipios = public_procedure
  .input(optional(ObtenerMunicipiosSchemaDTO))
  .query<Municipio[]>(({ ctx, input }) => {
    return ctx.prisma.municipios.findMany({
      where: {
        estados: {
          codigo: input?.por_estado,
        },
      },
    });
  });
