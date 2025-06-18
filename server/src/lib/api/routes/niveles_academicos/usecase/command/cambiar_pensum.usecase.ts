import { array, InferOutput, object } from "valibot";
import { admin_procedure } from "../../../../procedures";
import { PensumDTO, PensumSchema, SeccionSchema } from "@swai/core";
import { obtener_pensum_fn } from "../../../institucion";

export const CambiarPensumSchemaDTO = object({
    nivel_academico: SeccionSchema.entries.nivel_academico,
    pensum: array(
        object({
            area_de_formacion: PensumSchema.entries.area_de_formacion,
            horas: PensumSchema.entries.horas,
        })
    )
})

export type CambiarPensumDTO = InferOutput<typeof CambiarPensumSchemaDTO>

export const cambiar_pensum = admin_procedure.input(CambiarPensumSchemaDTO).mutation<PensumDTO>(async ({ ctx, input }) => {
    await ctx.prisma.pensum.deleteMany({
        where: {
            nivel_academico: input.nivel_academico
        }
    })

    await ctx.prisma.pensum.createMany({
        data: input.pensum.map((area_de_formacion) => ({
            nivel_academico: input.nivel_academico,
            area_de_formacion: area_de_formacion.area_de_formacion,
            horas: area_de_formacion.horas
        }))
    })

    return await obtener_pensum_fn({ params: { nivel_academico: input.nivel_academico }, deps: { prisma: ctx.prisma } }) as PensumDTO

})