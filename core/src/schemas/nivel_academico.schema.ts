import { InferOutput, number, object, string } from 'valibot';

export const NivelAcademicoSchema = object({
  numero: number(),
  nombre: string(),
});

export type NivelAcademico = InferOutput<typeof NivelAcademicoSchema>;

export enum NIVEL_ACADEMICO {
  Primero = 1,
  Segundo,
  Tercero,
  Cuarto,
  Quinto,
  Egresado,
}

export const NIVELES_ACADEMICOS = [
  {
    numero: 1,
    nombre: 'Primer Año',
  },
  {
    numero: 2,
    nombre: 'Segundo Año',
  },
  {
    numero: 3,
    nombre: 'Tercer Año',
  },
  {
    numero: 4,
    nombre: 'Cuarto Año',
  },
  {
    numero: 5,
    nombre: 'Quinto Año',
  },
  {
    numero: 6,
    nombre: 'Egresado',
  },
] as const;

export const NIVELES_ACADEMICOS_MAP = NIVELES_ACADEMICOS.reduce<
  Record<NivelAcademico['numero'], NivelAcademico>
>((map, it) => {
  map[it.numero] = it;
  return map;
}, {});
