import { PrismaClient } from '@prisma/client';
import {
  CedulaSchema,
  EstudianteDTO,
  EstudianteNoExisteError,
  EstudianteSchemaDTO,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import { calcular_edad } from '../../../../../../utils';
import { parser, parse } from 'valibot';

export async function obtener_estudiante_fn({
  params,
  deps,
}: {
  params: { cedula: number };
  deps: { prisma: PrismaClient };
}): Promise<EstudianteDTO> {
  const estudiante_db = await deps.prisma.estudiantes.findUnique({
    where: { cedula: params.cedula },
    include: {
      personas: {
        include: {
          estados_civiles: true,
          tipos_de_sangre: true,
          discapacitados: {
            include: {
              tipos_de_discapacidad: true,
            },
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
  });

  if (!estudiante_db) throw EstudianteNoExisteError;

  const estudiante = parse(EstudianteSchemaDTO, {
    ...estudiante_db.personas,
    ...estudiante_db,
    estado_civil: estudiante_db.personas.estados_civiles,
    tipo_de_sangre: estudiante_db.personas.tipos_de_sangre,
    discapacidad: estudiante_db.personas.discapacitados && {
      ...estudiante_db.personas.discapacitados,
      tipo_de_discapacidad:
        estudiante_db.personas.discapacitados.tipos_de_discapacidad,
    },
    edad: calcular_edad(estudiante_db.personas.fecha_de_nacimiento),
    nivel_academico: estudiante_db.niveles_academicos,
    estado_academico: estudiante_db.estados_academicos,
    tipo: estudiante_db.tipos_de_estudiante,
    municipio_de_nacimiento: {
      ...estudiante_db.municipios,
      estado_federal: estudiante_db.municipios.estados,
    },
    seccion: estudiante_db.seccion
      ? {
          ...estudiante_db.secciones,
          profesor_guia: estudiante_db.secciones!.profesor_guia
            ? {
                ...estudiante_db.secciones!.profesores!.personas,
                ...estudiante_db.secciones!.profesores,
              }
            : null,
        }
      : null,
  });

  return estudiante;
}

export const obtener_estudiante = admin_procedure
  .input(parser(CedulaSchema))
  .query<EstudianteDTO>(({ ctx, input }) =>
    obtener_estudiante_fn({
      deps: { prisma: ctx.prisma },
      params: { cedula: input },
    })
  );
