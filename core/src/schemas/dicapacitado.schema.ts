import { enum_, InferOutput, nullable, object, string } from 'valibot';
import { CedulaSchema } from './cedula.schema';
import {
  TIPO_DE_DISCAPACIDAD,
  TipoDeDiscapacidadSchema,
} from './tipo_de_discapacidad.schema';

export const DiscapacitadoSchema = object({
  cedula: CedulaSchema,
  tipo_de_discapacidad: enum_(TIPO_DE_DISCAPACIDAD),
  descripcion: nullable(string()),
});

export type Discapacitado = InferOutput<typeof DiscapacitadoSchema>;

/* ................................... dto .................................. */

export const DiscapacitadoSchemaDTO = object({
  ...DiscapacitadoSchema.entries,
  tipo_de_discapacidad: TipoDeDiscapacidadSchema,
});

export type DiscapacitadoDTO = InferOutput<typeof DiscapacitadoSchema>;
