import { InferOutput } from 'valibot';
import { IdNombreSchema } from './id_nombre.schema';

export const TipoDeSangreSchema = IdNombreSchema;

export type TipoDeSangre = InferOutput<typeof TipoDeSangreSchema>;

export enum TIPO_DE_SANGRE {
  'O-' = 1,
  'O+',
  'A−',
  'A+',
  'B−',
  'B+',
  'AB−',
  'AB+',
}

export const TIPOS_DE_SANGRE: TipoDeSangre[] = [
  { id: 1, nombre: 'O-' },
  { id: 2, nombre: 'O+' },
  { id: 3, nombre: 'A−' },
  { id: 4, nombre: 'A+' },
  { id: 5, nombre: 'B−' },
  { id: 6, nombre: 'B+' },
  { id: 7, nombre: 'AB−' },
  { id: 8, nombre: 'AB+' },
] as const;
