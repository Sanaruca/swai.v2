import { InferOutput } from 'valibot';
import { IdNombreSchema } from './id_nombre.schema';

export const TipoDeEspacioAcademicoSchema = IdNombreSchema;

export type TipoDeEspacioAcademico = InferOutput<
  typeof TipoDeEspacioAcademicoSchema
>;

export enum TIPO_DE_ESPACIO_ACADEMICO {
  SALON_DE_CLASES = 1,
  LABORATORIO,
  BIBLIOTECA,
  AUDITORIO,
  AIRE_LIBRE,
}

export const TIPOS_DE_ESPACIO_ACADEMICO = [
  { id: 1, nombre: 'Salon de clases' },
  { id: 2, nombre: 'Laboratorio' },
  { id: 3, nombre: 'Biblioteca' },
  { id: 4, nombre: 'Auditorio' },
  { id: 5, nombre: 'Aire Libre' },
] as const;
