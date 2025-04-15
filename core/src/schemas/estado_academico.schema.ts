import { IdNombre, IdNombreSchema } from './id_nombre.schema';

export const EstadoAcademicoSchema = IdNombreSchema;

export interface EstadoAcademico extends IdNombre {}

export enum ESTADO_ACADEMICO {
  ACTIVO = 1,
  NO_INSCRITO,
  RETIRADO,
  EGRESADO,
}

export const ESTADOS_ACADEMICOS = [
  {
    id: ESTADO_ACADEMICO.ACTIVO as number,
    nombre: 'ACTIVO',
  },
  {
    id: ESTADO_ACADEMICO.NO_INSCRITO as number,
    nombre: 'NO INSCRITO',
  },
  {
    id: ESTADO_ACADEMICO.RETIRADO as number,
    nombre: 'RETIRADO',
  },
  {
    id: ESTADO_ACADEMICO.EGRESADO as number,
    nombre: 'EGRESADO',
  },
];

export const ESTADOS_ACADEMICOS_MAP = ESTADOS_ACADEMICOS.reduce<
  Record<EstadoAcademico['id'], EstadoAcademico>
>((map, it) => {
  map[it.id] = it;
  return map;
}, {});
