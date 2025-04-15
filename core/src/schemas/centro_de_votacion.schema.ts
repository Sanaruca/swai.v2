import { InferOutput, object, string } from 'valibot';

export const CentroDeVotacionSchema = object({
  codigo: string(),
  nombre: string(),
  codigo_parroquia: string(),
});
export type CentroDeVotacion = InferOutput<typeof CentroDeVotacionSchema>;
