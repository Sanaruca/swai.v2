import { TituloPregrado } from '@swai/core';
import { public_procedure } from '../../../../procedures';

export const obtener_titulos_de_pregrado = public_procedure.query<
  TituloPregrado[]
>(({ ctx }) => {
  return ctx.prisma.titulos_de_pregrado.findMany();
});
