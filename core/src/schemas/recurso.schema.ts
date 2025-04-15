import { InferOutput } from 'valibot';
import { IdNombreSchema } from './id_nombre.schema';

export const RecursoSchema = IdNombreSchema;
export type Recurso = InferOutput<typeof RecursoSchema>;

export enum RECURSO {
  COMPUTADORAS = 1,
  IMPRESORAS,
  LIBROS,
  PROYECTORES,
}

export const RECURSOS = [
  { id: 1, nombre: 'Computadoras' },
  { id: 2, nombre: 'Impresoras' },
  { id: 3, nombre: 'Libros' },
  { id: 4, nombre: 'Proyectores' },
];
