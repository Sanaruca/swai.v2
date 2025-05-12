import {
  array,
  InferOutput,
  object,
  optional,
  parse,
  parser,
  partial,
  pipe,
  string,
  toLowerCase,
  trim,
} from 'valibot';
import { admin_procedure } from '../../../../procedures';
import { EmpleadoSchemaDTO, EstudianteSchemaDTO } from '@swai/core';
import { obtener_estudiante_fn } from '../../../estudiantes';
import { obtener_empleado_fn } from '../../../empleados/usecase/query/obtener_empleado.usecase';
import { Paginated, PaginationParams, PaginationParamsSchema } from '../../../../../../lib/schemas';

export const ObtenerBusquedaRapidaSchemaDTO = object({
  busqueda: pipe(string(), trim(), toLowerCase()),
  paginacion: optional(partial(PaginationParamsSchema)),
});

export type ObtenerBusquedaRapidaDTO = InferOutput<
  typeof ObtenerBusquedaRapidaSchemaDTO
>;

export const BusquedaRapidaSchemaDTO = object({
  empleados: array(EmpleadoSchemaDTO),
  estudiantes: array(EstudianteSchemaDTO),
  // niveles_academicos: array(NivelAcademicoSchema),
  // secciones_academicas: array(SeccionSchema),
});

export type BusquedaRapidaDTO = InferOutput<typeof BusquedaRapidaSchemaDTO>;

export const obtener_busqueda_rapida = admin_procedure
  .input(parser(ObtenerBusquedaRapidaSchemaDTO))
  .query<Paginated<BusquedaRapidaDTO>>(async ({ ctx, input }) => {

    const paginacion = parse(
      PaginationParamsSchema,
      input?.paginacion ?? {}
    ) as Required<PaginationParams>;

    const busqueda_int = parseInt(input.busqueda, 10);

    const [
      [estudiante_cedulas_total],
      estudiante_cedulas,
      [empleado_cedulas_total],
      empleado_cedulas,
      niveles_academicos,
      espacios_academicos,
      secciones_academicas,
    ] = await Promise.all([
      /* ............................... estudiantes .............................. */
      ctx.prisma.$queryRaw<[{ count: bigint }]>`
        SELECT count(*) FROM estudiantes e
        JOIN personas p ON e.cedula = p.cedula
        WHERE lower(p.nombres) LIKE ${`%${input.busqueda}%`} OR lower(p.apellidos) LIKE ${`%${input.busqueda}%`} OR CAST(e.cedula AS TEXT) LIKE ${
          !isNaN(busqueda_int) ? '%' + busqueda_int + '%' : null
        }
      `,
      ctx.prisma.$queryRaw<{ cedula: number }[]>`
        SELECT e.cedula FROM estudiantes e
        JOIN personas p ON e.cedula = p.cedula
        WHERE lower(p.nombres) LIKE ${`%${input.busqueda}%`} OR lower(p.apellidos) LIKE ${`%${input.busqueda}%`} OR CAST(e.cedula AS TEXT) LIKE ${
          !isNaN(busqueda_int) ? '%' + busqueda_int + '%' : null
        }
        LIMIT ${paginacion.limit} OFFSET ${(paginacion.page - 1) * paginacion.limit}
      `,
      /* ................................ empleados ............................... */
      ctx.prisma.$queryRaw<[{ count: bigint }]>`
        SELECT count(*) FROM empleados e
        JOIN personas p ON e.cedula = p.cedula
        WHERE lower(p.nombres) LIKE ${`%${input.busqueda}%`} OR lower(p.apellidos) LIKE ${`%${input.busqueda}%`} OR CAST(e.cedula AS TEXT) LIKE ${
          !isNaN(busqueda_int) ? '%' + busqueda_int + '%' : null
        }
      `,
      ctx.prisma.$queryRaw<{ cedula: number }[]>`
        SELECT e.cedula FROM empleados e
        JOIN personas p ON e.cedula = p.cedula
        WHERE lower(p.nombres) LIKE ${`%${input.busqueda}%`} OR lower(p.apellidos) LIKE ${`%${input.busqueda}%`} OR CAST(e.cedula AS TEXT) LIKE ${
          !isNaN(busqueda_int) ? '%' + busqueda_int + '%' : null
        }
        LIMIT ${paginacion.limit} OFFSET ${(paginacion.page - 1) * paginacion.limit}
      `,
      
      /* .................................. otros ................................. */
      ctx.prisma.niveles_academicos.findMany({
        where: {
          OR: [
            { nombre: { contains: input.busqueda, mode: 'insensitive' } },
            busqueda_int ? { numero: busqueda_int } : {}, // Si el input es número, buscar por `numero`
          ],
        },
      }),
      ctx.prisma.espacios_academicos.findMany({
        where: { nombre: { contains: input.busqueda, mode: 'insensitive' } },
        select: { id: true, nombre: true, capacidad: true },
      }),
      ctx.prisma.secciones.findMany({
        where: { id: { contains: input.busqueda, mode: 'insensitive' } },
        select: { id: true, nivel_academico: true, seccion: true },
      }),
    ]);


    const [estudiantes, empleados] = await Promise.all([
      Promise.all(
        estudiante_cedulas.map(({cedula}) =>
          obtener_estudiante_fn({
            deps: { prisma: ctx.prisma },
            params: { cedula },
          })
        )
      ),
      Promise.all(
        empleado_cedulas.map(({cedula}) =>
          obtener_empleado_fn({
            deps: { prisma: ctx.prisma },
            args: { cedula },
          })
        )
      ),
    ]);

    // sumamos el total de resultados
    const total = Number(estudiante_cedulas_total.count + empleado_cedulas_total.count)

    // Calcular el total de páginas
    const pages = Math.ceil(total / paginacion.limit);

    return {
      ...paginacion,
      data: [
        {
          estudiantes,
          empleados,
        }
      ],
      pages,
      total,
    }


  });
