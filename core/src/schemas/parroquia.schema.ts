import { InferOutput, object, string } from 'valibot';

export const ParroquiaSchema = object({
  codigo: string(),
  nombre: string(),
  codigo_municipio: string(),
});

export type Parroquia = InferOutput<typeof ParroquiaSchema>;
