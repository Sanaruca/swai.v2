import { public_procedure } from "../../../../procedures";

export const obtener_areas_de_formacion = public_procedure.query(async ({ ctx }) => {
    return ctx.prisma.areas_de_formacion.findMany();
})