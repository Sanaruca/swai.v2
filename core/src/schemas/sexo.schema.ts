export interface Sexo {
  id: string;
  nombre: string;
}

export enum SEXO {
  MASCULINO = 'M',
  FEMENINO = 'F',
}

export const SEXOS: readonly Sexo[] = [
  {
    id: SEXO.MASCULINO,
    nombre: 'Masculino',
  },
  {
    id: SEXO.FEMENINO,
    nombre: 'Femenino',
  },
] as const;
