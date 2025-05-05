import {
    AdministrativoDTO,
    AdministrativoSchema,
    CedulaSchema,
    DiscapacitadoSchema,
    EmpleadoDTO,
    EmpleadoSchema,
    PersonaSchema,
    ProfesorDTO,
    ProfesorSchema,
    SwaiError,
    SwaiErrorCode,
    TIPO_DE_EMPLEADO,
} from '@swai/core';
import { admin_procedure } from '../../../../../api/procedures';
import { InferOutput, nullable, object, omit, parser, partial, pick } from 'valibot';
import { obtener_empleado_fn } from '../query/obtener_empleado.usecase';

export const ActualizarEmpleadoSchemaDTO = object({
  cedula: CedulaSchema,
  datos: partial(
    object({
      ...pick(PersonaSchema, [
        'nombres',
        'apellidos',
        'estado_civil',
        'telefono',
        'correo',
        'tipo_de_sangre',
        'direccion'
      ]).entries,
      ...omit(EmpleadoSchema, ['cedula']).entries,
      ...omit(ProfesorSchema, ['cedula']).entries,
      ...omit(AdministrativoSchema, ['cedula']).entries,
      discapacidad: nullable(partial(omit(DiscapacitadoSchema, ['cedula']))),
    })
  ),
});

export type ActualizarEmpleadoDTO = InferOutput<
  typeof ActualizarEmpleadoSchemaDTO
>;

export const actualizar_empelado = admin_procedure
  .input(parser(ActualizarEmpleadoSchemaDTO))
  .mutation<EmpleadoDTO | AdministrativoDTO | ProfesorDTO>(
    async ({ ctx, input }) => {
      const [empleado, discapacitado] = await ctx.prisma.$transaction([
        ctx.prisma.empleados.findUnique({
          where: { cedula: input.cedula },
        }),
        ctx.prisma.discapacitados.findUnique({
          where: { cedula: input.cedula },
        }),
      ]);

      if (!empleado)
        throw new SwaiError({
          codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
          mensaje: `Empleado no existe`,
        });

      // TODO: Quiza crear un array de transacciones, añadirle a medida de las condiciones y luego ejecutarlas al final sea buena idea.

      if (discapacitado && input.datos.discapacidad) {
        await ctx.prisma.discapacitados.update({
          where: { cedula: input.cedula },
          data: {
            tipo_de_discapacidad: input.datos.discapacidad.tipo_de_discapacidad,
            descripcion: input.datos.discapacidad.descripcion,
          },
        });
      } else if (!discapacitado && input.datos.discapacidad) {
        if (!input.datos.discapacidad.tipo_de_discapacidad) {
          throw new SwaiError({
            codigo: SwaiErrorCode.VALIDACION_CAMPO_REQUERIDO,
            mensaje: `El tipo de discapacidad es requerido`,
          });
        }

        await ctx.prisma.discapacitados.create({
          data: {
            cedula: input.cedula,
            tipo_de_discapacidad: input.datos.discapacidad.tipo_de_discapacidad,
            descripcion: input.datos.discapacidad.descripcion,
          },
        });
      } else if (discapacitado && input.datos.discapacidad === null) {
        await ctx.prisma.discapacitados.delete({
          where: { cedula: input.cedula },
        });
      }

      const actualizacion_de_empleado = ctx.prisma.empleados.update({
        where: { cedula: input.cedula },
        data: {
          tipo_de_empleado: input.datos.tipo_de_empleado,
          rif: input.datos.rif,
          codigo_carnet_patria: input.datos.codigo_carnet_patria,
          centro_de_votacion: input.datos.centro_de_votacion,
          fecha_de_ingreso: input.datos.fecha_de_ingreso,
        },
      });

      const actualizacion_de_persona = ctx.prisma.personas.update({
        where: { cedula: input.cedula },
        data: {
          nombres: input.datos.nombres,
          apellidos: input.datos.apellidos,
          estado_civil: input.datos.estado_civil,
          telefono: input.datos.telefono,
          correo: input.datos.correo,
          tipo_de_sangre: input.datos.tipo_de_sangre,
            direccion: input.datos.direccion,
        },
      });

      if (empleado.tipo_de_empleado === TIPO_DE_EMPLEADO.ADMINISTRATIVO) {
        const actualizacion_de_administrativo =
          ctx.prisma.administrativos.update({
            where: { cedula: input.cedula },
            data: {
              titulo_de_pregrado: input.datos.titulo_de_pregrado,
            },
          });

        await ctx.prisma.$transaction([
          actualizacion_de_empleado,
          actualizacion_de_persona,
          actualizacion_de_administrativo,
        ]);
      } else if (empleado.tipo_de_empleado === TIPO_DE_EMPLEADO.DOCENTE) {
        const actualizacion_de_profesor = ctx.prisma.profesores.update({
          where: { cedula: input.cedula },
          data: {
            titulo_de_pregrado: input.datos.titulo_de_pregrado,
            especialidad: input.datos.especialidad,
            plantel_de_dependencia: input.datos.plantel_de_dependencia,
          },
        });

        await ctx.prisma.$transaction([
          actualizacion_de_empleado,
          actualizacion_de_persona,
          actualizacion_de_profesor,
        ]);
      } else if (empleado.tipo_de_empleado === TIPO_DE_EMPLEADO.OBRERO) {
        await ctx.prisma.$transaction([
          actualizacion_de_empleado,
          actualizacion_de_persona,
        ]);
      }

      return await obtener_empleado_fn({
        deps: { prisma: ctx.prisma },
        args: { cedula: input.cedula },
      });
    }
  );
