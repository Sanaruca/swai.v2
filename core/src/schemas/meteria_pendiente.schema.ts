import { InferOutput, number, object } from 'valibot';
import { AreaDeFromacionSchema } from './area_de_formacion.schema';
import { CedulaSchema } from './cedula.schema';

export const MateriaPendienteSchema = object({
  id: number(),
  estudiante: CedulaSchema,
  area_de_formacion: AreaDeFromacionSchema.entries.codigo,
});


export type MateriaPendiente = InferOutput<typeof MateriaPendienteSchema>;
