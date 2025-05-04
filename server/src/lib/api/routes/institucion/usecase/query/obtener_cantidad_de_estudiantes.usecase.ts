import {
  ESTADO_ACADEMICO,
  NIVEL_ACADEMICO,
  NivelAcademicoSchema,
  SeccionSchema,
  TIPO_DE_ESTUDIANTE,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import { object, number, array, InferOutput, parse } from 'valibot';

export const CantidadDeEstudiantesSchemaDTO = object({
  activos: number(),
  no_inscritos: number(),
  retirados: number(),
  egresados: number(),
  masculino: number(),
  femenino: number(),
  discapacitados: number(),
  en_gestacion: number(),
  repitientes: number(),
  total: number(),
  niveles_academicos: array(
    object({
      ...NivelAcademicoSchema.entries,
      activos: number(),
      no_inscritos: number(),
      retirados: number(),
      total: number(),
      secciones: array(
        object({
          ...SeccionSchema.entries,
          activos: number(),
          no_inscritos: number(),
          retirados: number(),
          total: number(),
        })
      ),
    })
  ),
});

export type CantidadDeEstudiantesDTO = InferOutput<
  typeof CantidadDeEstudiantesSchemaDTO
>;

export const obtener_cantidad_de_estudiantes =
  admin_procedure.query<CantidadDeEstudiantesDTO>(async ({ ctx }) => {
    const [
      activos,
      egresados,
      no_inscritos,
      masculino,
      femenino,
      [discapacitados],
      repitientes,
      retirados,
      niveles_academicos,
    ] = await ctx.prisma.$transaction([
      ctx.prisma.estudiantes.count({
        where: {
          estado_academico: ESTADO_ACADEMICO.ACTIVO,
        },
      }),
      ctx.prisma.estudiantes.count({
        where: {
          estado_academico: ESTADO_ACADEMICO.EGRESADO,
        },
      }),
      ctx.prisma.estudiantes.count({
        where: {
          estado_academico: ESTADO_ACADEMICO.NO_INSCRITO,
        },
      }),
      ctx.prisma.estudiantes.count({
        where: {
          personas: {
            sexo: 'M',
          },
        },
      }),
      ctx.prisma.estudiantes.count({
        where: {
          personas: {
            sexo: 'F',
          },
        },
      }),
      ctx.prisma.$queryRaw<[{ total: bigint }]>`
    SELECT COUNT(*) as total
    FROM estudiantes e
    JOIN personas p ON e.cedula = p.cedula
    JOIN discapacitados d ON p.cedula = d.cedula;
`,
      ctx.prisma.estudiantes.count({
        where: {
          tipo: TIPO_DE_ESTUDIANTE.REPITIENTE,
        },
      }),
      ctx.prisma.estudiantes.count({
        where: {
          estado_academico: ESTADO_ACADEMICO.RETIRADO,
        },
      }),
      ctx.prisma.niveles_academicos.findMany({
        where: {
          numero: { not: NIVEL_ACADEMICO.Egresado },
        },
        orderBy: {
          numero: 'asc',
        },
        include: {
          _count: {
            select: {
              estudiantes: true,
            },
          },
          secciones: {
            orderBy: {
              seccion: 'asc',
            },
            include: {
              _count: {
                select: {
                  estudiantes: {},
                },
              },
            },
          },
        },
      }),
    ]);

    const total = activos + no_inscritos + egresados + retirados;

    const estados_por_nivel = niveles_academicos.map((nivel) =>
      ctx.prisma.$transaction([
        ctx.prisma.estudiantes.count({
          where: {
            nivel_academico: nivel.numero,
            estado_academico: ESTADO_ACADEMICO.ACTIVO,
          },
        }),
        ctx.prisma.estudiantes.count({
          where: {
            nivel_academico: nivel.numero,
            estado_academico: ESTADO_ACADEMICO.NO_INSCRITO,
          },
        }),
        ctx.prisma.estudiantes.count({
          where: {
            nivel_academico: nivel.numero,
            estado_academico: ESTADO_ACADEMICO.RETIRADO,
          },
        }),
      ])
    );

    const niveles_con_estados = await Promise.all(estados_por_nivel);

    const estados_por_secciones_por_nivel = niveles_academicos.map((nivel) =>
      nivel.secciones.map((seccion) =>
        ctx.prisma.$transaction([
          ctx.prisma.estudiantes.count({
            where: {
              seccion: seccion.id,
              estado_academico: ESTADO_ACADEMICO.ACTIVO,
            },
          }),
          ctx.prisma.estudiantes.count({
            where: {
              seccion: seccion.id,
              estado_academico: ESTADO_ACADEMICO.NO_INSCRITO,
            },
          }),
          ctx.prisma.estudiantes.count({
            where: {
              seccion: seccion.id,
              estado_academico: ESTADO_ACADEMICO.RETIRADO,
            },
          }),
        ])
      )
    );

    const secciones_con_estado_por_nivel = await Promise.all(
      estados_por_secciones_por_nivel.map((it) => Promise.all(it))
    );

    return parse(CantidadDeEstudiantesSchemaDTO, {
      activos,
      no_inscritos,
      egresados,
      retirados,
      masculino,
      femenino,
      discapacitados: Number(discapacitados.total),
      // TODO: Cambiar cuando se implemente la funcionalidad de gestación
      en_gestacion: 0,
      repitientes,
      total,
      niveles_academicos: niveles_academicos.map((nivel_academico, i) => {
        const [activos, no_inscritos, retirados] = niveles_con_estados[i];

        return {
          ...nivel_academico,
          total: nivel_academico._count.estudiantes, // Asegúrate de que esto sea correcto
          activos,
          no_inscritos,
          retirados,
          secciones: nivel_academico.secciones.map((seccion, j) => {
            const [activos, no_inscritos, retirados] =
              secciones_con_estado_por_nivel[i][j];

            return {
              ...seccion,
              activos,
              no_inscritos,
              retirados,
              total: seccion._count.estudiantes, // Asegúrate de que esto sea correcto
            };
          }),
        };
      }),
    });
  });
