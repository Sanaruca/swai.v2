import { InferOutput } from 'valibot';
import { IdNombreSchema } from './id_nombre.schema';

export const EstadoDeUnRecursoSchema = IdNombreSchema;

export type EstadoDeUnRecurso = InferOutput<typeof EstadoDeUnRecursoSchema>;

export enum ESTADO_DE_UN_RECURSO {
  NUEVO = 1,
  BUEN_ESTADO,
  REPARACION_NECESARIA,
  EN_MAL_ESTADO,
  OBSOLETO,
}

export const ESTADOS_DE_UN_RECURSO: EstadoDeUnRecurso[] = [
  { id: 1, nombre: 'Nuevo' },
  { id: 2, nombre: 'Buen estado' },
  { id: 3, nombre: 'Reparacion necesaria' },
  { id: 4, nombre: 'En mal estado' },
  { id: 5, nombre: 'Obsoleto' },
] as const;
