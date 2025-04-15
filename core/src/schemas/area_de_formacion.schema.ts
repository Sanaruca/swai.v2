import { InferOutput, object, string } from 'valibot';

export const AreaDeFromacionSchema = object({
  codigo: string(),
  nombre: string(),
});
export type AreaDeFromacion = InferOutput<typeof AreaDeFromacionSchema>;
