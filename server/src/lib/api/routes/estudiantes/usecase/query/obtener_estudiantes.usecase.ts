import type { Prisma } from '@prisma/client';
import {
  NivelAcademicoSchema,
  EstadoAcademicoSchema,
  EstudianteDTO,
  EstudianteSchemaDTO,
  SeccionSchema,
  generateFiltroSchema,
  PersonaSchema,
  Persona,
  Estudiante,
  EstudianteSchema,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import {
  PaginationParamsSchema,
  Paginated,
  PaginationParams,
} from '../../../../../schemas';
import { calcular_edad } from '../../../../../../utils';
import {
  parse,
  object,
  optional,
  pipe,
  string,
  trim,
  array,
  partial,
  InferOutput,
  parser,
  getDefaults,
} from 'valibot';
import { CoreFiltroToPrismaFilterMapper } from '../../../../../adapters/CoreFiltroToPrismaFilter.mapper';

export const ObtenerEstudiantesSchemaDTO = object({
  por_nombre: optional(pipe(string(), trim())),
  por_nivel_academico: optional(array(NivelAcademicoSchema.entries.numero)),
  por_secion: optional(array(SeccionSchema.entries.seccion)),
  por_estado_academico: optional(array(EstadoAcademicoSchema.entries.id)),
  filtros: optional(
    array(
      generateFiltroSchema<keyof Persona | keyof Estudiante>({
        campos_validos: [
          'nombres',
          'apellidos',
          'sexo',
          'estado_academico',
          'tipo_de_sangre',
          'nivel_academico',
          'tipo',
          'estatura',
          'peso',
          'chemise',
          'fecha_de_inscripcion',
          'fecha_de_nacimiento',
        ],
      })
    )
  ),
  paginacion: optional(partial(PaginationParamsSchema)),
});

export type ObtenerEstudiantesDTO = InferOutput<
  typeof ObtenerEstudiantesSchemaDTO
>;

export const obtener_estudiantes = admin_procedure
  .input(
    parser(
      optional(
        ObtenerEstudiantesSchemaDTO,
        getDefaults(ObtenerEstudiantesSchemaDTO) as any
      )
    )
  )
  .query<Paginated<EstudianteDTO>>(async ({ ctx, input }) => {
    const paginacion = parse(
      PaginationParamsSchema,
      input?.paginacion ?? {}
    ) as Required<PaginationParams>;

    const filtros: Prisma.estudiantesWhereInput = {
      estado_academico: { in: input?.por_estado_academico },
      nivel_academico: { in: input?.por_nivel_academico },
      secciones: {
        OR: input?.por_secion?.map((seccion) => ({ seccion })),
      },
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

        AND: input?.filtros
          ?.filter((it) =>
            Object.keys(PersonaSchema.entries).includes(it.campo)
          )
          ?.map((filtro) => CoreFiltroToPrismaFilterMapper.map(filtro)),
      },

      AND: input?.filtros
        ?.filter((it) =>
          Object.keys(EstudianteSchema.entries).includes(it.campo)
        )
        ?.map((filtro) => CoreFiltroToPrismaFilterMapper.map(filtro)),
    };

    const [estudiantes, total] = await ctx.prisma.$transaction([
      ctx.prisma.estudiantes.findMany({
        skip: (paginacion.page - 1) * paginacion.limit, // Saltar los resultados de las páginas anteriores
        take: paginacion.limit, // Tomar el número de resultados especificado
        where: filtros,
        include: {
          personas: {
            include: {
              tipos_de_sangre: true,
              estados_civiles: true,
              discapacitados: {
                include: { tipos_de_discapacidad: true },
              },
            },
          },
          niveles_academicos: true,
          estados_academicos: true,
          tipos_de_estudiante: true,
          municipios: {
            include: {
              estados: true,
            },
          },
          secciones: {
            include: {
              profesores: {
                include: {
                  personas: true,
                },
              },
            },
          },
        },
      }),
      ctx.prisma.estudiantes.count({ where: filtros }),
    ]);

    // Calcular el total de páginas
    const pages = Math.ceil(total / paginacion.limit);

    const data = estudiantes.map((estudiante) =>
      parse(EstudianteSchemaDTO, {
        ...estudiante.personas,
        estado_civil: estudiante.personas.estados_civiles,
        ...estudiante,
        tipo_de_sangre: estudiante.personas.tipos_de_sangre,
        discapacidad: estudiante.personas.discapacitados && {
          ...estudiante.personas.discapacitados,
          tipo_de_discapacidad:
            estudiante.personas.discapacitados.tipos_de_discapacidad,
        },
        edad: calcular_edad(estudiante.personas.fecha_de_nacimiento),
        nivel_academico: estudiante.niveles_academicos,
        municipio_de_nacimiento: {
          ...estudiante.municipios,
          estado_federal: estudiante.municipios.estados,
        },
        tipo: estudiante.tipos_de_estudiante,
        estado_academico: estudiante.estados_academicos,
        seccion: estudiante.seccion
          ? {
              ...estudiante.secciones,
              profesor_guia: estudiante.secciones!.profesor_guia
                ? {
                    ...estudiante.secciones!.profesores!.personas,
                    ...estudiante.secciones!.profesores,
                  }
                : null,
            }
          : null,
      })
    );

    return {
      ...paginacion,
      data,
      pages,
      total,
    };
  });
