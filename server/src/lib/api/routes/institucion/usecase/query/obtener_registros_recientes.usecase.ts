import { InferOutput, literal, object, pick, variant } from 'valibot';
import { admin_procedure } from '../../../../procedures';
import { PersonaSchemaDTO, TipoDeEmpleadoSchema } from '@swai/core';

const persona = pick(PersonaSchemaDTO, ['nombres', 'apellidos', 'cedula']);

export const RegistroRecienteSchemaDTO = variant('tipo', [
  object({
    tipo: literal('estudiante'),
    ...persona.entries,
  }),
  object({
    tipo: literal('empleado'),
    ...persona.entries,
    tipo_de_empleado: TipoDeEmpleadoSchema,
  }),
]);

export type RegistroRecienteDTO = InferOutput<
  typeof RegistroRecienteSchemaDTO
>;

export const obtener_registros_recientes =
  admin_procedure.query<RegistroRecienteDTO[]>(async ({ ctx }) => {
    const personas = await ctx.prisma.personas.findMany({
      select: {
        cedula: true,
        nombres: true,
        apellidos: true,
        empleados: {
          select: {
            cedula: true,
            tipos_de_empleado: true,
          },
        },
        estudiantes: {
          select: {
            cedula: true,
          },
        },
      },
      take: 10,
    });

    const registros_recientes = personas.map((persona) => {
      if (persona.estudiantes) {
        return {
          tipo: 'estudiante',
          cedula: persona.cedula,
          nombres: persona.nombres,
          apellidos: persona.apellidos,
        } as RegistroRecienteDTO;
      } else if (persona.empleados) {
        return {
          tipo: 'empleado',
          cedula: persona.cedula,
          nombres: persona.nombres,
          apellidos: persona.apellidos,
          tipo_de_empleado: persona.empleados.tipos_de_empleado,
        } as RegistroRecienteDTO;
      }
      return null;
    });

    return registros_recientes.filter((it) => it !== null);
  });
