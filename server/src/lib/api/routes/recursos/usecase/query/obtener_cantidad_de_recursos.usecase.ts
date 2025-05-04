import { InferOutput, number, object } from 'valibot';
import { admin_procedure } from '../../../../procedures/admin.procedure';

export const CantidadDeRecursosSchemaDTO = object({
  total: number(),
})

export type CantidadDeRecursosDTO = InferOutput<typeof CantidadDeRecursosSchemaDTO>;


export const obtener_cantidad_de_recursos = admin_procedure.query<CantidadDeRecursosDTO>(
    async ({ ctx }) => {
        const total = await ctx.prisma.recursos_de_un_espacio_academico.count({
        });
    
        return {
            total
        }
    }
)