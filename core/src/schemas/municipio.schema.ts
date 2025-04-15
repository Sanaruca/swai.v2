import { InferOutput, object, string } from 'valibot';
import { EstadoFederalSchema } from './estado_federal.schema';

export const MunicipioSchema = object({
  codigo: string(),
  nombre: string(),
  codigo_estado: string(),
});

export type Municipio = InferOutput<typeof MunicipioSchema>;

/* ................................... dto .................................. */

export const MunicipioSchemaDTO = object({
  codigo: string(),
  nombre: string(),
  estado_federal: EstadoFederalSchema,
});

export type MunicipioDTO = InferOutput<typeof MunicipioSchemaDTO>;
