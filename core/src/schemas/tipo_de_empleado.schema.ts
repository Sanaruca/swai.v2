import { InferOutput } from 'valibot';
import { IdNombreSchema } from './id_nombre.schema';

export const TipoDeEmpleadoSchema = IdNombreSchema;

export type TipoDeEmpleado = InferOutput<typeof TipoDeEmpleadoSchema>;

export enum TIPO_DE_EMPLEADO {
  ADMINISTRATIVO = 1,
  DOCENTE,
  OBRERO,
}

export const TIPOS_DE_EMPLEADO = [
  {
    id: 1,
    nombre: 'Administrativo',
  },
  {
    id: 2,
    nombre: 'Docente',
  },
  {
    id: 3,
    nombre: 'Obrero',
  },
] as const;
