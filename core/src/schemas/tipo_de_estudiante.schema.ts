import { IdNombre, IdNombreSchema } from './id_nombre.schema';

export const TipoDeEstudianteSchema = IdNombreSchema;
export interface TipoDeEstudiante extends IdNombre {}

export enum TIPO_DE_ESTUDIANTE {
  REGULAR = 1,
  REPITIENTE,
  EGRESADO,
}

export const TIPOS_DE_ESTUDIANTE: TipoDeEstudiante[] = [
  {
    id: 1,
    nombre: 'Regular',
  },
  {
    id: 2,
    nombre: 'Repitiente',
  },
  {
    id: 3,
    nombre: 'Egresado',
  },
] as const;
