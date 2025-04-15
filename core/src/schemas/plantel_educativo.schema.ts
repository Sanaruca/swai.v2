import { InferOutput, object, pipe, string, toUpperCase } from 'valibot';
import { EstadoFederalSchema } from './estado_federal.schema';

export const PlantelEducativoSchema = object({
  dea: pipe(string(), toUpperCase()),
  nombre: string(),
  zona_educativa: EstadoFederalSchema.entries.codigo,
});

export type PlantelEducativo = InferOutput<typeof PlantelEducativoSchema>;
