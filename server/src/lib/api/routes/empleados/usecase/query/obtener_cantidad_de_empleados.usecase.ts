import { TipoDeEmpleadoSchema } from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import { object, array, number, InferOutput } from 'valibot';

export const CantidadDeEmpleadosSchemaDTO = object({
  tipos_de_empleado: array(
    object({
      ...TipoDeEmpleadoSchema.entries,
      total: number(),
    })
  ),
  total: number(),
});

export type CantidadDeEmpleadosDTO = InferOutput<
  typeof CantidadDeEmpleadosSchemaDTO
>;

export const obtener_cantidad_de_empleados =
  admin_procedure.query<CantidadDeEmpleadosDTO>(async ({ ctx }) => {
    const tipos_de_empleados = await ctx.prisma.tipos_de_empleado.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        _count: {
          select: {
            empleados: true,
          },
        },
      },
    });

    return tipos_de_empleados.reduce(
      (data, tipo) => {
        data.tipos_de_empleado.push({
          id: tipo.id,
          nombre: tipo.nombre,
          total: tipo._count.empleados,
        });

        data.total += tipo._count.empleados;

        return data;
      },
      {
        tipos_de_empleado: [],
        total: 0,
      } as CantidadDeEmpleadosDTO
    );
  });
