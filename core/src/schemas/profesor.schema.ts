import { InferOutput, object } from 'valibot';
import { TituloPregradoSchema } from './titulo_de_pregrado.schema';
import { EspecialidadSchema } from './especialidad.schema';
import { PlantelEducativoSchema } from './plantel_educativo.schema';
import { PersonaSchema, PersonaSchemaDTO } from './persona.schema';

export const ProfesorSchema = object({
  cedula: PersonaSchema.entries.cedula,
  titulo_de_pregrado: TituloPregradoSchema.entries.id,
  especialidad: EspecialidadSchema.entries.id,
  plantel_de_dependencia: PlantelEducativoSchema.entries.dea,
});

export type Profesor = InferOutput<typeof ProfesorSchema>;

/* ................................... dto .................................. */

export const ProfesorSchemaDTO = object({
  ...PersonaSchemaDTO.entries,
  ...ProfesorSchema.entries,
  titulo_de_pregrado: TituloPregradoSchema,
  especialidad: EspecialidadSchema,
  plantel_de_dependencia: PlantelEducativoSchema,
});

export type ProfesorDTO = InferOutput<typeof ProfesorSchemaDTO>;