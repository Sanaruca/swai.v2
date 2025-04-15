import { RECURSO } from '@swai/core';

export enum RecursoPrimeicon {
  COMPUTADORAS = 'pi pi-desktop',
  IMPRESORAS = 'pi pi-print',
  LIBROS = 'pi pi-book',
  PROYECTORES = 'pi pi-video',
}

export const recurso_primeicon_map: Record<RECURSO, RecursoPrimeicon> = {
  [RECURSO.COMPUTADORAS]: RecursoPrimeicon.COMPUTADORAS,
  [RECURSO.IMPRESORAS]: RecursoPrimeicon.IMPRESORAS,
  [RECURSO.LIBROS]: RecursoPrimeicon.LIBROS,
  [RECURSO.PROYECTORES]: RecursoPrimeicon.PROYECTORES,
} as const;
