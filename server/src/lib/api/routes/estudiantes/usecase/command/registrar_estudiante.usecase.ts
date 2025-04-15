import {
  EstudianteSchema,
  EstudianteRegistradoError,
  SwaiError,
  SwaiErrorCode,
  TIPO_DE_ESTUDIANTE,
  ESTADO_ACADEMICO,
  NIVEL_ACADEMICO,
  ESTADO_CIVIL,
  PersonaSchema,
  DiscapacitadoSchema,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import { omit, object, nullish, parser, parse, InferOutput } from 'valibot';

export const RegistrarEstudianteSchemaDTO = object({
  ...omit(PersonaSchema, ['estado_civil']).entries,
  ...omit(EstudianteSchema, ['ultima_actualizacion']).entries,
  estado_academico: nullish(EstudianteSchema.entries.estado_academico),
  discapacidad: nullish(omit(DiscapacitadoSchema, ['cedula'])),
});

export type RegistrarEstudianteDTO = InferOutput<
  typeof RegistrarEstudianteSchemaDTO
>;

export const registrar_estudiante = admin_procedure
  .input(parser(RegistrarEstudianteSchemaDTO))
  .mutation(async ({ ctx, input }) => {
    const [estudiante, persona] = await ctx.prisma.$transaction([
      ctx.prisma.estudiantes.findUnique({
        where: { cedula: input.cedula },
        select: { cedula: true },
      }),
      ctx.prisma.personas.findUnique({
        where: { cedula: input.cedula },
        select: { cedula: true },
      }),
    ]);

    if (estudiante) {
      throw EstudianteRegistradoError;
    }

    if (persona) {
      throw new SwaiError({
        codigo: SwaiErrorCode.RECURSO_CONFLICTO,
        mensaje: 'Ya existe una persona registrada en el sistema',
        descripcion: 'Verifique el número de cédula e intente nuevamente',
      });
    }

    if (
      input.tipo === TIPO_DE_ESTUDIANTE.EGRESADO ||
      input.estado_academico === ESTADO_ACADEMICO.EGRESADO
    ) {
      input.nivel_academico = NIVEL_ACADEMICO.Egresado;
      input.seccion = null;
      input.tipo = TIPO_DE_ESTUDIANTE.EGRESADO;
      input.estado_academico = ESTADO_ACADEMICO.EGRESADO;
    } else {
      console.log('validando');
      parse(EstudianteSchema.entries.estado_academico, input.estado_academico);
    }

    return await ctx.prisma.personas.create({
      data: {
        cedula: input.cedula,
        nombres: input.nombres,
        apellidos: input.apellidos,
        direccion: input.direccion!,
        fecha_de_nacimiento: input.fecha_de_nacimiento,
        estado_civil: ESTADO_CIVIL.SOLTERO,
        telefono: input.telefono,
        sexo: input.sexo,
        tipo_de_sangre: input.tipo_de_sangre,
        discapacitados: {
          create: input.discapacidad || undefined,
        },
        estudiantes: {
          create: {
            fecha_de_inscripcion: input.fecha_de_inscripcion ?? null,
            estado_academico: input.estado_academico!,
            nivel_academico: input.nivel_academico,
            tipo: input.tipo,
            seccion: input.seccion,
            peso: input.peso,
            estatura: input.estatura,
            chemise: input.chemise,
            pantalon: input.pantalon,
            ultima_actualizacion: new Date(),
            municipio_de_nacimiento: input.municipio_de_nacimiento,
            fecha_de_egreso: input.fecha_de_egreso,
          },
        },
      },
    });
  });
