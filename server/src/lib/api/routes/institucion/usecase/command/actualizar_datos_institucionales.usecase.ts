import {
  InstitucionDTO,
  InstitucionSchema,
  SwaiError,
  SwaiErrorCode,
} from '@swai/core';
import { admin_procedure } from 'server/src/lib/api/procedures';
import { object, parser, pick } from 'valibot';
import { obtener_datos_de_la_institucion_fn } from '../query/obtener_datos_de_la_institucion.usecase';

export const ActualizarDatosInstitucionalesSchema = object({
  actualizacion: pick(InstitucionSchema, [
    'nombre',
    'rif',
    'direccion',
    'telefono',
    'correo',
    'periodo_academico_actual',
    'inicio_de_periodo_academico',
    'fin_de_periodo_academico',
    'fecha_de_fundacion',
  ]),
});

export const actualizar_datos_institucionales = admin_procedure
  .input(parser(ActualizarDatosInstitucionalesSchema))
  .mutation<InstitucionDTO>(async ({ ctx, input }) => {
    const institucion = await ctx.prisma.institucion.findFirst();

    if (!institucion) {
      throw new SwaiError({
        codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
        mensaje: 'No se encontró la institución.',
      });
    }

    const { actualizacion } = input;

    await ctx.prisma.institucion.update({
      where: {
        codigo: institucion.codigo,
      },
      data: actualizacion,
    });

    return await obtener_datos_de_la_institucion_fn({
      deps: { prisma: ctx.prisma },
    });
  });
