import { InferOutput, integer, number, object, pipe, string } from 'valibot';

export const IdNombreSchema = object({
  id: pipe(number(), integer()),
  nombre: string(),
});

export type IdNombre = InferOutput<typeof IdNombreSchema>;
