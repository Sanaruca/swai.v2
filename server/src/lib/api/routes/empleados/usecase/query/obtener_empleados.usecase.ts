import {
  Administrativo,
  AdministrativoDTO,
  AdministrativoSchemaDTO,
  Empleado,
  EmpleadoDTO,
  EmpleadoSchemaDTO,
  generateFiltroSchema,
  Persona,
  ProfesorDTO,
  ProfesorSchemaDTO,
  TIPO_DE_EMPLEADO,
  Profesor,
  PersonaSchema,
  EmpleadoSchema,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import {
  Paginated,
  PaginationParams,
  PaginationParamsSchema,
} from '../../../../../schemas';
import {
  array,
  enum_,
  InferOutput,
  object,
  optional,
  parse,
  parser,
  string,
} from 'valibot';
import type { Prisma } from '@prisma/client';
import { CoreFiltroToPrismaFilterMapper } from '../../../../../adapters/CoreFiltroToPrismaFilter.mapper';

export const ObtenerEmpleadosSchemaDTO = object({
  /**
   * @deprecated
   */
  por_tipo: optional(enum_(TIPO_DE_EMPLEADO)),
  por_nombre: optional(string()),
  paginacion: optional(PaginationParamsSchema),
  filtros: optional(
    array(
      generateFiltroSchema<
        | keyof Persona
        | keyof Empleado
        | keyof Administrativo
        | keyof Profesor
      >({
        campos_validos: [
          'cedula',
          'nombres',
          'apellidos',
          'sexo',
          'estado_civil',
          'tipo_de_sangre',
          'fecha_de_nacimiento',
          'tipo_de_empleado',
        ],
      })
    )
  ),
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


      const filtros: Prisma.empleadosWhereInput = {
        AND: input?.filtros?.filter(it => Object.keys(EmpleadoSchema.entries).includes(it.campo))?.map(filtro => CoreFiltroToPrismaFilterMapper.map(filtro)),
        personas: {
          OR: [
          {
            nombres: {
              contains: input?.por_nombre ?? '', // Busca coincidencias parciales en el nombre
              mode: 'insensitive', // Ignora mayúsculas y minúsculas
            },
          },
          {
            apellidos: {
              contains: input?.por_nombre ?? '', // Busca coincidencias parciales en el apellido
              mode: 'insensitive', // Ignora mayúsculas y minúsculas
            },
          },
        ],

          AND: input?.filtros?.filter((it) => Object.keys(PersonaSchema.entries).includes(it.campo))?.map((filtro) => CoreFiltroToPrismaFilterMapper.map(filtro)),
        }
      }

      const [empleados, total] = await ctx.prisma.$transaction([
        ctx.prisma.empleados.findMany({
          skip: (paginacion.page - 1) * paginacion.limit, // Saltar los resultados de las páginas anteriores
          take: paginacion.limit, // Tomar el número de resultados especificado
          where: filtros,
          include: {
            personas: {
              include: {
                estados_civiles: true,
                tipos_de_sangre: true,
              },
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
                secciones: true,
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
            seccion_guia: empleado.profesores?.secciones[0],
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
