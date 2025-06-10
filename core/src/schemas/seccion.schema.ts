import {
  number,
  object,
  enum as enum_,
  string,
  InferOutput,
  pipe,
  custom,
  nullish,
  toUpperCase,
  trim,
} from 'valibot';
import { NIVEL_ACADEMICO } from './nivel_academico.schema';

export const SeccionSchema = object({
  id: pipe(
    string(),
    custom<`${number}${string}`>((v) => /^[1-5][A-Z]+$/.test(v as string))
  ),
  nivel_academico: pipe(
    enum_(NIVEL_ACADEMICO),
    custom(
      (v) => (Number(v) <= 5),
      'El nivel academico debe ser menor o igual a 5'
    )
  ),
  seccion: pipe(string(), toUpperCase(), trim()),
  profesor_guia: nullish(number()), // TODO: relacionar
});

export type Seccion = InferOutput<typeof SeccionSchema>;

