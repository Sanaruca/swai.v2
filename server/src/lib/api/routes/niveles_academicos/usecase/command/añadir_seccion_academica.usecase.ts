import { object, parser } from "valibot";
import { admin_procedure } from "../../../../procedures";
import { get_next_section_value, SeccionSchema, SwaiError, SwaiErrorCode } from "@swai/core";


export const AñadirSeccionAcademicaSchemaDTO = object({
    nivel_academico: SeccionSchema.entries.nivel_academico,
    seccion: SeccionSchema.entries.seccion,
})

export const añadir_seccion_academica = admin_procedure.input(parser((AñadirSeccionAcademicaSchemaDTO))).mutation(async ({ ctx, input }) => {

    const ultima_seccion = await ctx.prisma.secciones.findFirst({
      where: {
        nivel_academico: input.nivel_academico
      },
      orderBy: {
        seccion: "desc"
      }
    })


    if (input.seccion) {
      const seccion = await ctx.prisma.secciones.findFirst({
        where: {
          nivel_academico: input.nivel_academico,
          seccion: input.seccion,
        },
      });
  
      if (seccion)
        throw new SwaiError({
          codigo: SwaiErrorCode.RECURSO_CONFLICTO,
          mensaje: 'Seccion académica ya existe',
        });
    }

    
    const nueva_seccion = input.seccion || get_next_section_value(ultima_seccion?.seccion || '');

    await ctx.prisma.secciones.create({
      data: {
        id: `${input.nivel_academico}${nueva_seccion}`,
        nivel_academico: input.nivel_academico,
        seccion: nueva_seccion,
        profesor_guia: null,
      }
    })



})