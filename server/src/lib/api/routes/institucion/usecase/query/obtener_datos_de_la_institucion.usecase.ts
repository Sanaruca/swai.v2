import { InstitucionDTO, InstitucionSchemaDTO, SwaiError, SwaiErrorCode } from '@swai/core';
import { public_procedure } from '../../../../procedures';
import { parse } from 'valibot';

export const obtener_datos_de_la_institucion = public_procedure.query<InstitucionDTO>(
  async ({ ctx }) => {
    
    const institucion = await ctx.prisma.institucion.findFirst({
      include: {
        planteles_educativos: true,
        municipios: {
          include: {
            estados: true
          }
        }
      }
    });

    if (!institucion) {
      throw new SwaiError({
        codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
        mensaje: 'No se encontró la institución.',
      });
    }

    return parse(InstitucionSchemaDTO, {
      ...institucion,
      plantel_educativo: institucion.planteles_educativos,
      municipio: {...institucion.municipios, estado_federal: institucion.municipios.estados},
    });
  }
);
