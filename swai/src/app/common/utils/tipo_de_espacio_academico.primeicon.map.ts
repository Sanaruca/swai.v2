import { TIPO_DE_ESPACIO_ACADEMICO } from '@swai/core';

export enum TipoDeEspacioAcademicoPrimeicon {
  SALON_DE_CLASES = 'pi pi-check-circle',
  LABORATORIO = 'pi pi-cog',
  BIBLIOTECA = 'pi pi-book',
  AUDITORIO = 'pi pi-box',
  AIRE_LIBRE = 'pi pi-cloud',
}

export const tipo_de_espacio_academico_primeicon_map: Record<
  TIPO_DE_ESPACIO_ACADEMICO,
  TipoDeEspacioAcademicoPrimeicon
> = {
  [TIPO_DE_ESPACIO_ACADEMICO.SALON_DE_CLASES]:
    TipoDeEspacioAcademicoPrimeicon.SALON_DE_CLASES,
  [TIPO_DE_ESPACIO_ACADEMICO.LABORATORIO]:
    TipoDeEspacioAcademicoPrimeicon.LABORATORIO,
  [TIPO_DE_ESPACIO_ACADEMICO.BIBLIOTECA]:
    TipoDeEspacioAcademicoPrimeicon.BIBLIOTECA,
  [TIPO_DE_ESPACIO_ACADEMICO.AUDITORIO]:
    TipoDeEspacioAcademicoPrimeicon.AUDITORIO,
  [TIPO_DE_ESPACIO_ACADEMICO.AIRE_LIBRE]:
    TipoDeEspacioAcademicoPrimeicon.AIRE_LIBRE,
} as const;
