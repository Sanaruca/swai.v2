/* ................................... dto .................................. */

import { object, nullish, InferOutput } from "valibot";
import { EmpleadoSchemaDTO } from "./empleado.schema";
import { EspecialidadSchema } from "./especialidad.schema";
import { PlantelEducativoSchema } from "./plantel_educativo.schema";
import { ProfesorSchema } from "./profesor.schema";
import { TituloPregradoSchema } from "./titulo_de_pregrado.schema";
import { SeccionSchema } from "./seccion.schema";

export const ProfesorSchemaDTO = object({
  ...EmpleadoSchemaDTO.entries,
  ...ProfesorSchema.entries,
  titulo_de_pregrado: TituloPregradoSchema,
  especialidad: EspecialidadSchema,
  plantel_de_dependencia: PlantelEducativoSchema,
  seccion_guia: nullish(SeccionSchema),
});

export type ProfesorDTO = InferOutput<typeof ProfesorSchemaDTO>;