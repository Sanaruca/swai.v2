import { CedulaSchema, SwaiError, SwaiErrorCode } from "@swai/core";
import { admin_procedure } from "../../../../procedures/admin.procedure";
import { InferOutput, object, parser } from "valibot";

const EliminarEstudianteSchemaDTO = object({
    cedula: CedulaSchema,
})

export type EliminarEstudianteDTO = InferOutput<typeof EliminarEstudianteSchemaDTO>

export const eliminar_estudiante = admin_procedure.input(parser(EliminarEstudianteSchemaDTO)).mutation(async ({ ctx, input }) => {

    const estudiante = await ctx.prisma.estudiantes.findUnique({
        where: {
            cedula: input.cedula
        }
    })

    if (!estudiante) {
        throw new SwaiError({
            codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
            mensaje: 'Estudiante no encontrado',
            metadata: {
                cedula: input.cedula
            }
        })
    }

    return await ctx.prisma.personas.delete({
        where: {
            cedula: input.cedula
        }
    })
})