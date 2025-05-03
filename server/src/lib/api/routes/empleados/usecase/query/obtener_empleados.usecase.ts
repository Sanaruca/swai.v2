import {
  AdministrativoDTO,
  AdministrativoSchemaDTO,
  EmpleadoDTO,
  EmpleadoSchemaDTO,
  ProfesorDTO,
  ProfesorSchemaDTO,
  TIPO_DE_EMPLEADO,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import {
  Paginated,
  PaginationParams,
  PaginationParamsSchema,
} from '../../../../../schemas';
import { enum_, InferOutput, object, optional, parse, parser } from 'valibot';

export const ObtenerEmpleadosSchemaDTO = object({
  por_tipo: optional(enum_(TIPO_DE_EMPLEADO)),
  paginacion: optional(PaginationParamsSchema),
});

export type ObtenerEmpleadosDTO = InferOutput<typeof ObtenerEmpleadosSchemaDTO>;

export const obtener_empleados = admin_procedure
  .input(parser(optional(ObtenerEmpleadosSchemaDTO)))
  .query<Paginated<EmpleadoDTO | AdministrativoDTO | ProfesorDTO>>(
    async ({ ctx, input }) => {
      const paginacion = parse(
        PaginationParamsSchema,
        input?.paginacion ?? {}
      ) as Required<PaginationParams>;

      const [empleados, total] = await ctx.prisma.$transaction([
        ctx.prisma.empleados.findMany({
          skip: (paginacion.page - 1) * paginacion.limit, // Saltar los resultados de las páginas anteriores
          take: paginacion.limit, // Tomar el número de resultados especificado
          where: {
            tipo_de_empleado: input?.por_tipo,
          },
          include: {
            personas: {
              include: {
                estados_civiles: true,
                tipos_de_sangre: true
              }
            },
            centros_de_votacion: true,
            tipos_de_empleado: true,
            administrativos: {
              include: {
                titulos_de_pregrado: true,
              },
            },
            profesores: {
              include: {
                titulos_de_pregrado: true,
                especialidades: true,
                planteles_educativos: true,
              },
            },
          },
        }),
        ctx.prisma.empleados.count(),
      ]);

      // Calcular el total de páginas
      const pages = Math.ceil(total / paginacion.limit);

      const data = empleados.map((empleado) => {
        const base = {
          ...empleado.personas,
          estado_civil: empleado.personas.estados_civiles,
          tipo_de_sangre: empleado.personas.tipos_de_sangre,
          ...empleado,
          tipo_de_empleado: empleado.tipos_de_empleado,
          centro_de_votacion: empleado.centros_de_votacion,
        };

        if (empleado.tipo_de_empleado === TIPO_DE_EMPLEADO.ADMINISTRATIVO) {
          return parse(AdministrativoSchemaDTO, {
            ...base,
            titulo_de_pregrado: empleado.administrativos?.titulos_de_pregrado,
          });
        }

        if (empleado.tipo_de_empleado === TIPO_DE_EMPLEADO.DOCENTE) {
          return parse(ProfesorSchemaDTO, {
            ...base,
            titulo_de_pregrado: empleado.profesores?.titulos_de_pregrado,
            especialidad: empleado.profesores?.especialidades,
            plantel_de_dependencia: empleado.profesores?.planteles_educativos,
          });
        }

        return parse(EmpleadoSchemaDTO, base);
      });

      return {
        ...paginacion,
        data,
        pages,
        total,
      };
    }
  );
