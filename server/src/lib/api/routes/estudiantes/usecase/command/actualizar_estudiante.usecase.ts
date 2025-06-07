import {
  AreaDeFromacionSchema,
  CedulaSchema,
  DiscapacitadoSchema,
  ESTADO_ACADEMICO,
  EstudianteDTO,
  EstudianteNoExisteError,
  EstudianteSchema,
  NIVEL_ACADEMICO,
  NIVELES_ACADEMICOS,
  PersonaSchema,
  SeccionSchema,
  SwaiError,
  SwaiErrorCode,
  TIPO_DE_ESTUDIANTE,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import {
  array,
  nullable,
  nullish,
  object,
  omit,
  parser,
  partial,
} from 'valibot';
import { obtener_estudiante_fn } from '../query/obtener_estudiante.usecase';

// Definición del esquema para la actualización del estudiante
export const ActualizarEstudianteSchemaDTO = object({
  estudiante: CedulaSchema,
  actualizacion: partial(
    object({
      ...omit(PersonaSchema, [
        'estado_civil',
        'cedula',
        'fecha_de_nacimiento',
        'sexo',
      ]).entries,
      ...omit(EstudianteSchema, [
        'ultima_actualizacion',
        'cedula',
        'municipio_de_nacimiento',
        'seccion',
      ]).entries,
      seccion: nullable(SeccionSchema.entries.seccion),
      estado_academico: nullish(EstudianteSchema.entries.estado_academico),
      discapacidad: nullable(omit(DiscapacitadoSchema, ['cedula'])),
      materias_pendientes: nullish(array(AreaDeFromacionSchema.entries.codigo)),
    })
  ),
});

// Procedimiento para actualizar el estudiante
export const actualizar_estudiante = admin_procedure
  .input(parser(ActualizarEstudianteSchemaDTO))
  .mutation<EstudianteDTO>(async ({ ctx, input }) => {
    const { actualizacion } = input;
    const { discapacidad } = actualizacion;

    let seccion: string | null | undefined;

    if (actualizacion.tipo === TIPO_DE_ESTUDIANTE.EGRESADO) {
      seccion = null;
      actualizacion.estado_academico = ESTADO_ACADEMICO.EGRESADO;
      actualizacion.nivel_academico = NIVEL_ACADEMICO.Egresado;
      actualizacion.materias_pendientes = null;
    } else if (actualizacion.nivel_academico) {
      const es_egresado =
        actualizacion.nivel_academico === NIVEL_ACADEMICO.Egresado;
      const tiene_seccion = actualizacion.seccion !== undefined;

      if (es_egresado || !tiene_seccion) {
        // Si es egresado o no tiene sección, seccion se queda como null
        actualizacion.tipo = TIPO_DE_ESTUDIANTE.EGRESADO;
        actualizacion.estado_academico = ESTADO_ACADEMICO.EGRESADO;
        seccion = null;
        actualizacion.materias_pendientes = null;
      } else {
        const seccion_db = await ctx.prisma.secciones.findFirst({
          where: {
            nivel_academico: actualizacion.nivel_academico,
            seccion: actualizacion.seccion!,
          },
        });

        if (!seccion_db) {
          throw new SwaiError({
            codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
            mensaje: 'Sección académica no existe',
            descripcion: `La sección "${actualizacion.seccion}" de "${
              NIVELES_ACADEMICOS[actualizacion.nivel_academico - 1].nombre
            }" no ha sido encontrada`,
          });
        }

        seccion = seccion_db.id;
      }
    }

    // Obtener estudiante y discapacidad en una transacción
    const [estudiante, discapacitado] = await ctx.prisma.$transaction([
      ctx.prisma.estudiantes.findUnique({
        where: { cedula: input.estudiante },
      }),
      ctx.prisma.discapacitados.findUnique({
        where: { cedula: input.estudiante },
      }),
    ]);

    // Verificar si el estudiante existe
    if (!estudiante) throw EstudianteNoExisteError;

    // Actualizar datos en una transacción
    await ctx.prisma.$transaction([
      // Manejo de la discapacidad
      ...(discapacidad
        ? [
            discapacitado
              ? ctx.prisma.discapacitados.update({
                  where: { cedula: discapacitado.cedula },
                  data: discapacidad,
                })
              : ctx.prisma.discapacitados.create({
                  data: { cedula: estudiante.cedula, ...discapacidad },
                }),
          ]
        : discapacidad === null && discapacitado
        ? [
            ctx.prisma.discapacitados.delete({
              where: { cedula: discapacitado.cedula },
            }),
          ]
        : []),

      // Actualización de la persona
      ctx.prisma.personas.update({
        where: { cedula: estudiante.cedula },
        data: {
          nombres: actualizacion.nombres,
          apellidos: actualizacion.apellidos,
          direccion: actualizacion.direccion,
          telefono: actualizacion.telefono,
          correo: actualizacion.correo,
          tipo_de_sangre: actualizacion.tipo_de_sangre,
        },
      }),

      // Actualización del estudiante
      ctx.prisma.estudiantes.update({
        where: { cedula: estudiante.cedula },
        data: {
          fecha_de_inscripcion: actualizacion.fecha_de_inscripcion,
          estado_academico: actualizacion.estado_academico || undefined,
          nivel_academico: actualizacion.nivel_academico,
          tipo: actualizacion.tipo,
          seccion,
          peso: actualizacion.peso,
          estatura: actualizacion.estatura,
          chemise: actualizacion.chemise,
          pantalon: actualizacion.pantalon,
          fecha_de_egreso: actualizacion.fecha_de_egreso,
        },
      }),
    ]);

    // actulizar materias pendientes

    if (
      actualizacion.materias_pendientes ||
      actualizacion.materias_pendientes === null
    ) {
      await ctx.prisma.materias_pendientes.deleteMany({
        where: {
          estudiante: estudiante.cedula,
        },
      });

      if (actualizacion.materias_pendientes !== null) {
        await ctx.prisma.materias_pendientes.createMany({
          data: actualizacion.materias_pendientes.map((area_de_formacion) => ({
            estudiante: estudiante.cedula,
            area_de_formacion,
          })),
        });
      }
    }

    // Retornar el estudiante actualizado
    return await obtener_estudiante_fn({
      deps: { prisma: ctx.prisma },
      params: { cedula: estudiante.cedula },
    });
  });
