import {
  date,
  enum_,
  InferOutput,
  nullish,
  object,
  pipe,
  string,
  trim,
} from 'valibot';
import { ESTADO_CIVIL, EstadoCivilSchema } from './estado_civil.schema';
import { SEXO } from './sexo.schema';
import { TIPO_DE_SANGRE, TipoDeSangreSchema } from './tipo_de_sangre.schema';
import { CedulaSchema } from './cedula.schema';
import { DiscapacitadoSchemaDTO } from './dicapacitado.schema';

export const PersonaSchema = object({
  cedula: CedulaSchema,
  nombres: pipe(string(), trim()),
  apellidos: string(),
  direccion: nullish(string()),
  fecha_de_nacimiento: date(),
  estado_civil: enum_(ESTADO_CIVIL),
  telefono: string(),
  correo: string(),
  sexo: enum_(SEXO),
  tipo_de_sangre: enum_(TIPO_DE_SANGRE),
  ultima_actualizacion: date(),
});

export type Persona = InferOutput<typeof PersonaSchema>;

/* ................................... dto .................................. */

export const PersonaSchemaDTO = object({
  ...PersonaSchema.entries,
  discapacidad: nullish(DiscapacitadoSchemaDTO),
  tipo_de_sangre: TipoDeSangreSchema,
  estado_civil: EstadoCivilSchema
});

export type PersonaDTO = InferOutput<typeof PersonaSchemaDTO>;
