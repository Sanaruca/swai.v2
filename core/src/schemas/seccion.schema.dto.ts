/* ................................... dto .................................. */

import { InferOutput, nullish, object } from "valibot";
import { SeccionSchema } from "./seccion.schema";
import { PersonaSchema } from "./persona.schema";
import { ProfesorSchema } from "./profesor.schema";

export const SeccionSchemaDTO = object({
  ...SeccionSchema.entries,
  profesor_guia: nullish(object({...PersonaSchema.entries, ...ProfesorSchema.entries})),
});

export type SeccionDTO = InferOutput<typeof SeccionSchemaDTO>;
