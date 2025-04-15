import { InferOutput } from 'valibot';
import { IdNombreSchema } from './id_nombre.schema';

export const TituloPregradoSchema = IdNombreSchema;

export type TituloPregrado = InferOutput<typeof TituloPregradoSchema>;
