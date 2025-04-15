import {
  EspacioAcademicoSchema,
  EspacioAcademico,
  SwaiError,
  SwaiErrorCode,
} from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import { generate_slug } from '../../../../../../utils';
import { omit, InferOutput, parser } from 'valibot';

export const RegistrarEspacioAcademicoSchemaDTO = omit(EspacioAcademicoSchema, [
  'id',
  'metadata',
]);

export type RegistrarEspacioAcademicoDTO = InferOutput<
  typeof RegistrarEspacioAcademicoSchemaDTO
>;

export const registrar_espacio_academico = admin_procedure
  .input(parser(RegistrarEspacioAcademicoSchemaDTO))
  .mutation<EspacioAcademico>(async ({ ctx, input }) => {
    const espacio = await ctx.prisma.espacios_academicos.findUnique({
      where: {
        nombre: input.nombre,
      },
    });

    if (espacio)
      throw new SwaiError({
        codigo: SwaiErrorCode.RECURSO_CONFLICTO,
        mensaje: 'El nombre del espacio académico y esta registrado',
      });

    const espacio_academico = await ctx.prisma.espacios_academicos.create({
      data: {
        ...input,
        metadata: {
          slug: generate_slug(input.nombre),
        },
      },
    });

    return espacio_academico as any;
  });
