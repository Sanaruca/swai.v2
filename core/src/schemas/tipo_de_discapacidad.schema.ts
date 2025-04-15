import { InferOutput } from 'valibot';
import { IdNombreSchema } from './id_nombre.schema';

export const TipoDeDiscapacidadSchema = IdNombreSchema;

export type TipoDeDiscapacidad = InferOutput<typeof TipoDeDiscapacidadSchema>;

export enum TIPO_DE_DISCAPACIDAD {
  FISICA = 1,
  VISUAL,
  AUDITIVA,
  INTELECTUAL,
  PSICOSOCIAL,
  MULTIPLE,
}

export const TIPOS_DE_DISCAPACIDAD: TipoDeDiscapacidad[] = [
  { id: 1, nombre: 'Fisíca' },
  { id: 2, nombre: 'Visual' },
  { id: 3, nombre: 'Auditiva' },
  { id: 4, nombre: 'Intelectual' },
  { id: 5, nombre: 'Psicosocial' },
  { id: 6, nombre: 'Múltiple' },
] as const;
