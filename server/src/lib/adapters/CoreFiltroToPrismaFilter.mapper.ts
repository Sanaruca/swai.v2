import type { Prisma } from '@prisma/client';
import {
    BooleanCondicion,
    DateCondicion,
    Filtro,
    NumberCondicion,
    SelectableCondicion,
    StringCondicion,
} from '@swai/core';

type PrismaFilterType =
  | Prisma.IntFilter
  | Prisma.StringFilter
  | Prisma.BoolFilter
  | Prisma.DateTimeFilter;
export type PrismaFilter = {
  [key: string]: PrismaFilterType;
};

export class CoreFiltroToPrismaFilterMapper {
  static map(filtro: Filtro): PrismaFilter {
    let condicion: PrismaFilterType | undefined;

    if (typeof filtro.valor === 'string') {
      switch (filtro.condicion) {
        case StringCondicion.DISTINTO:
          condicion = {
            not: { equals: filtro.valor },
          } as Prisma.StringFilter;
          break;
        case StringCondicion.IGUAL:
          condicion = {
            equals: filtro.valor,
          } as Prisma.StringFilter;
          break;
        case StringCondicion.CONTIENE:
          condicion = {
            contains: filtro.valor,
          } as Prisma.StringFilter;
          break;
      }
    }

    if (typeof filtro.valor === 'number') {
      switch (filtro.condicion) {
        case NumberCondicion.DISTINTO:
          condicion = {
            not: { equals: filtro.valor },
          } as Prisma.IntFilter;
          break;
        case NumberCondicion.IGUAL:
          condicion = {
            equals: filtro.valor,
          } as Prisma.IntFilter;
          break;
        case NumberCondicion.MAYOR_QUE:
          condicion = {
            gt: filtro.valor,
          } as Prisma.IntFilter;
          break;
        case NumberCondicion.MENOR_QUE:
          condicion = {
            lt: filtro.valor,
          } as Prisma.IntFilter;
          break;
        default:
          break;
      }
    }

    if (typeof filtro.valor === 'boolean') {
      switch (filtro.condicion) {
        case BooleanCondicion.DISTINTO:
          condicion = {
            not: { equals: filtro.valor },
          } as Prisma.BoolFilter;
          break;
        case BooleanCondicion.IGUAL:
          condicion = {
            equals: filtro.valor,
          } as Prisma.BoolFilter;
          break;
        default:
          break;
      }
    }

    if (typeof filtro.valor === 'object' && filtro.valor instanceof Date) {
      switch (filtro.condicion) {
        case DateCondicion.DISTINTA:
          condicion = {
            not: { equals: filtro.valor },
          } as Prisma.DateTimeFilter;
          break;
        case DateCondicion.IGUAL:
          condicion = {
            equals: filtro.valor,
          } as Prisma.DateTimeFilter;
          break;
        case DateCondicion.ANTES_DE:
          condicion = {
            lt: filtro.valor,
          } as Prisma.DateTimeFilter;
          break;
        case DateCondicion.DESPUES_DE:
          condicion = {
            gt: filtro.valor,
          } as Prisma.DateTimeFilter;
          break;
        default:
          break;
      }
    }

    if (typeof filtro.valor === 'object' && filtro.valor instanceof Array) {
      switch (filtro.condicion) {
        case SelectableCondicion.DISTINTO:
          condicion = {
            notIn: filtro.valor,
          } as PrismaFilterType;
          break;
        case SelectableCondicion.IGUAL:
          condicion = {
            in: filtro.valor,
          } as PrismaFilterType;
          break;

        default:
          break;
      }
    }

    if (!condicion)
      throw new Error('Error al mapear Filtros del Core a filtros de Prisma');

    return {
      [filtro.campo]: condicion,
    };
  }
}
