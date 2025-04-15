import { integer, maxValue, minValue, number, pipe } from 'valibot';

export const CedulaSchema = pipe(
  number(),
  integer(),
  minValue(1),
  maxValue(99_999_999)
);
