import { InferOutput } from "valibot";
import { IdNombreSchema } from "./id_nombre.schema";

export const  EstadoCivilSchema = IdNombreSchema 

type EstadoCivil = InferOutput<typeof EstadoCivilSchema>;

export enum ESTADO_CIVIL {
  SOLTERO = 1,
  CASADO,
  VIUDO,
  DIVORCIADO,
}
export const ESTADOS_CIVILES: EstadoCivil[] = [
  { id: 1, nombre: 'Soltero(a)' },
  { id: 2, nombre: 'Casado(a)' },
  { id: 3, nombre: 'Viudo(a)' },
  { id: 4, nombre: 'Divorciado(a)' },
] as const;
