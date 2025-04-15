import { InferOutput, object } from 'valibot';
import { PersonaSchema } from './persona.schema';
import { TituloPregradoSchema } from './titulo_de_pregrado.schema';
import { EmpleadoSchemaDTO } from './empleado.schema';

export const AdministrativoSchema = object({
  cedula: PersonaSchema.entries.cedula,
  titulo_de_pregrado: TituloPregradoSchema.entries.id,
});

export type Administratativo = InferOutput<typeof AdministrativoSchema>;

/* ................................... dto .................................. */

export const AdministrativoSchemaDTO = object({
  ...EmpleadoSchemaDTO.entries,
  ...AdministrativoSchema.entries,
  titulo_de_pregrado: TituloPregradoSchema,
});

export type AdministrativoDTO = InferOutput<typeof AdministrativoSchemaDTO>;