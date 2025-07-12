import { InstitucionDTO, InstitucionSchemaDTO, SwaiError, SwaiErrorCode } from '@swai/core';
import { public_procedure } from '../../../../procedures';
import { parse } from 'valibot';
import type { PrismaClient } from '@prisma/client';

export const obtener_datos_de_la_institucion = public_procedure.query<InstitucionDTO>(
  async ({ ctx }) => obtener_datos_de_la_institucion_fn({ deps: { prisma: ctx.prisma } })
);

export interface ObtenerDatosDeLaInstitucionParams {
 deps: {
  prisma: PrismaClient  
 }   
}

export async function obtener_datos_de_la_institucion_fn({ deps }: ObtenerDatosDeLaInstitucionParams): Promise<InstitucionDTO> {
    const { prisma } = deps;
    const institucion = await prisma.institucion.findFirst({
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
