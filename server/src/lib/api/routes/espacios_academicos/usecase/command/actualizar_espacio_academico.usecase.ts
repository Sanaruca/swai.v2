import {
  EspacioAcademicoSchema,
  EspacioAcademico,
  SwaiError,
  SwaiErrorCode,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import { generate_slug } from '../../../../../../utils';
import { object, InferOutput, parser } from 'valibot';
import { RegistrarEspacioAcademicoSchemaDTO } from './registrar_espacio_academico.usecase';

export const ActualizarEspacioAcademicoSchemaDTO = object({
  id: EspacioAcademicoSchema.entries.id,
  actualizacion: RegistrarEspacioAcademicoSchemaDTO,
});

export type ActualizarEspacioAcademicoDTO = InferOutput<
  typeof ActualizarEspacioAcademicoSchemaDTO
>;

export const actualizar_espacio_academico = admin_procedure
  .input(parser(ActualizarEspacioAcademicoSchemaDTO))
  .mutation<EspacioAcademico>(async ({ ctx, input }) => {
    const espacio_academico = await ctx.prisma.espacios_academicos.findUnique({
      where: { id: input.id },
    });

    if (!espacio_academico)
      throw new SwaiError({
        codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
        mensaje: 'Espacio académico no existe',
      });

    const nombre = await ctx.prisma.espacios_academicos.findUnique({
      where: {
        nombre: input.actualizacion.nombre,
      },
    });

    if (nombre && nombre.id !== espacio_academico.id)
      throw new SwaiError({
        codigo: SwaiErrorCode.RECURSO_CONFLICTO,
        mensaje: 'El nombre del espacio académico y esta registrado',
      });

    await ctx.prisma.espacios_academicos.update({
      where: {
        id: espacio_academico.id,
      },
      data: {
        ...input.actualizacion,
        metadata: {
          slug: generate_slug(input.actualizacion.nombre),
        },
      },
    });

    return { ...espacio_academico, ...input.actualizacion } as any;
  });
