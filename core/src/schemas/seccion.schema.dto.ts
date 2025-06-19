/* ................................... dto .................................. */

import { InferOutput, nullish, object, pick } from "valibot";
import { SeccionSchema } from "./seccion.schema";
import { PersonaSchema } from "./persona.schema";
import { ProfesorSchema } from "./profesor.schema";

export const SeccionSchemaDTO = object({
  ...SeccionSchema.entries,
  profesor_guia: nullish(object({...pick(PersonaSchema, ['cedula', 'nombres', 'apellidos']).entries, ...pick(ProfesorSchema, ['titulo_de_pregrado', 'especialidad', 'plantel_de_dependencia']).entries})),
});

export type SeccionDTO = InferOutput<typeof SeccionSchemaDTO>;
