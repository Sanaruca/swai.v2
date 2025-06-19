import { CedulaSchema, SwaiError, SwaiErrorCode } from "@swai/core";
import { admin_procedure } from "../../../../procedures";
import { parser } from "valibot";


export const eliminar_empleado = admin_procedure.input(parser(CedulaSchema)).mutation(
    async ({ ctx, input }) => {

        const empleado = await ctx.prisma.empleados.findUnique({
            where: {
                cedula: input
            }
        })

        if (!empleado) {
            throw new SwaiError({
                codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
                mensaje: 'Empleado no encontrado',
                metadata: {
                    cedula: input
                }
                
            })
        }


        ctx.prisma.personas.delete({
            where: {
                cedula: input
            }
        })
    }
)