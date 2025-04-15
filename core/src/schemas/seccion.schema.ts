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
import { ProfesorSchema } from './profesor.schema';
import { PersonaSchema } from './persona.schema';

export const SeccionSchema = object({
  id: pipe(
    string(),
    custom<`${number}${string}`>((v) => /^[1-5][A-Z]+$/.test(v as string))
  ),
  nivel_academico: enum_(NIVEL_ACADEMICO),
  seccion: pipe(string(), toUpperCase(), trim()),
  profesor_guia: nullish(number()), // TODO: relacionar
});

export type Seccion = InferOutput<typeof SeccionSchema>;

/* ................................... dto .................................. */

export const SeccionSchemaDTO = object({
  ...SeccionSchema.entries,
  profesor_guia: nullish(object({...PersonaSchema.entries, ...ProfesorSchema.entries})),
});

export type SeccionDTO = InferOutput<typeof SeccionSchemaDTO>;
