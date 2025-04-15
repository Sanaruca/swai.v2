import { InferOutput } from 'valibot';
import { IdNombreSchema } from './id_nombre.schema';

export const EspecialidadSchema = IdNombreSchema;

export type Especialidad = InferOutput<typeof EspecialidadSchema>;

export enum ESPECIALIDAD {
  MATEMATICAS = 1,
}

export const ESPECIALIDADES = [
  {
    id: 1,
    nombre: 'Matemáticas',
  },
] as const;
