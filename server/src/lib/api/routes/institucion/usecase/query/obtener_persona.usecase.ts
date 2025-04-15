import { CedulaSchema, SwaiError, SwaiErrorCode } from '@swai/core';
import { admin_procedure } from '../../../../procedures';
import { parser } from 'valibot';

export const obtener_persona = admin_procedure
  .input(parser(CedulaSchema))
  .query(async ({ ctx, input }) => {
    const persona = await ctx.prisma.personas.findUnique({
      where: { cedula: input },
    });

    if (!persona)
      throw new SwaiError({
        codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
        mensaje: 'Persona no existe',
        metadata: {
          cedula: input,
        },
      });

    return persona;
  });
