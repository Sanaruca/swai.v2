import {
  TIPO_DE_EMPLEADO,
  EmpleadoSchema,
  ProfesorSchema,
  AdministrativoSchema,
  Empleado,
  EntidadExisteError,
  PersonaSchema,
  Administratativo,
  Profesor,
  SeccionSchema,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import {
  variant,
  object,
  literal,
  omit,
  InferOutput,
  parser,
  parse,
  nullable,
} from 'valibot';

const PersonaSinUltimaActualizacionSchema = omit(PersonaSchema, ['ultima_actualizacion'])

export const RegistrarEmpleadoSchemaDTO = variant('tipo', [
  object({
    tipo: literal(TIPO_DE_EMPLEADO.DOCENTE),
    datos: object({
      ...PersonaSinUltimaActualizacionSchema.entries,
      ...omit(EmpleadoSchema, ['tipo_de_empleado', 'ultima_actualizacion']).entries,
      ...ProfesorSchema.entries,
      seccion_guia: nullable(SeccionSchema.entries.id),
    }),
  }),
  object({
    tipo: literal(TIPO_DE_EMPLEADO.ADMINISTRATIVO),
    datos: object({
      ...PersonaSinUltimaActualizacionSchema.entries,
      ...omit(EmpleadoSchema, ['tipo_de_empleado', 'ultima_actualizacion']).entries,
      ...AdministrativoSchema.entries,
    }),
  }),
  object({
    tipo: literal(TIPO_DE_EMPLEADO.OBRERO),
    datos: object({
      ...PersonaSinUltimaActualizacionSchema.entries,
      ...omit(EmpleadoSchema, ['tipo_de_empleado', 'ultima_actualizacion']).entries,
    }),
  }),
]);

export type RegistrarEmpleadoDTO = InferOutput<
  typeof RegistrarEmpleadoSchemaDTO
>;

export const registrar_empleado = admin_procedure
  .input(parser(RegistrarEmpleadoSchemaDTO))
  .mutation<Empleado>(async ({ ctx, input }) => {
    const cantidad_de_personas = await ctx.prisma.personas.count({
      where: { cedula: input.datos.cedula },
    });

    if (cantidad_de_personas) throw new EntidadExisteError('Persona');

    const persona = parse(PersonaSinUltimaActualizacionSchema, input.datos);
    const empleado = parse(omit(EmpleadoSchema, ['cedula', 'ultima_actualizacion']), {
      ...input.datos,
      tipo_de_empleado: input.tipo,
    });

    let administrativo: Administratativo | undefined;
    let profesor: Profesor | undefined;

    switch (input.tipo) {
      case TIPO_DE_EMPLEADO.ADMINISTRATIVO:
        administrativo = parse(AdministrativoSchema, input.datos);
        break;

      case TIPO_DE_EMPLEADO.DOCENTE:
        profesor = parse(ProfesorSchema, input.datos);
        break;

      default:
        break;
    }

    const persona_db = await ctx.prisma.personas.create({
      data: {
        ...(persona as any),
        empleados: {
          create: {
            tipo_de_empleado: empleado.tipo_de_empleado,
            rif: empleado.rif,
            codigo_carnet_patria: empleado.codigo_carnet_patria,
            centro_de_votacion: empleado.centro_de_votacion,
            fecha_de_ingreso: empleado.fecha_de_ingreso,
          },
        },
        ...(administrativo && {
          administrativos: {
            create: {
              titulo_de_pregrado: administrativo?.titulo_de_pregrado,
            },
          },
        }),
        ...(profesor && {
          profesores: {
            create: {
              titulo_de_pregrado: profesor?.titulo_de_pregrado,
              especialidad: profesor?.especialidad,
              plantel_de_dependencia: profesor?.plantel_de_dependencia,
            },
          },
        }),
      },
      include: {
        empleados: true,
      },
    });


    if (input.tipo === TIPO_DE_EMPLEADO.DOCENTE && input.datos.seccion_guia) {

      await ctx.prisma.secciones.update({
        where: {
          id: input.datos.seccion_guia,
        },
        data: {
          profesor_guia: persona_db.cedula
        },
      });
      
    }



    return parse(EmpleadoSchema, { ...persona_db, ...persona_db.empleados });
  });
