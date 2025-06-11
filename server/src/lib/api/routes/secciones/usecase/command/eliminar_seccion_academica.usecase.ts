import { SeccionSchema } from "@swai/core";
import { admin_procedure } from "../../../../procedures";
import { parser } from "valibot";

export const eliminar_seccion_academica = admin_procedure.input(parser(SeccionSchema.entries.id)).mutation(async ({ ctx, input }) => {


    await ctx.prisma.secciones.delete({
        where: {
            id: input
        }
    })


    return

})