import {
  object,
  number,
  array,
  pipe,
  integer,
  minValue,
  maxValue,
  InferOutput,
  GenericSchema,
  optional,
} from 'valibot';

// Esquema para los parámetros de paginación
export const PaginationParamsSchema = object({
  page: optional(pipe(number(), integer(), minValue(1)), 1), // Página mínima 1
  limit: optional(pipe(number(), integer(), minValue(1), maxValue(100)), 20), // Límite entre 1 y 100
});

export type PaginationParams = InferOutput<typeof PaginationParamsSchema>;

// Esquema para el resultado paginado
export const createPaginatedSchema = <T extends GenericSchema>(schema: T) =>
  object({
    data: array(schema), // Lista de datos paginados
    total: pipe(number(), integer(), minValue(0)), // Total de elementos
    page: pipe(number(), integer(), minValue(1)), // Página actual
    limit: pipe(number(), integer(), minValue(1), maxValue(100)), // Límite por página
  });

export interface Paginated<T = any> {
  data: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}
