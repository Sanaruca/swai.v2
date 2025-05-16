import {
  date,
  enum_,
  InferOutput,
  integer,
  nullish,
  number,
  object,
  pipe,
  string,
} from 'valibot';
import {
  ESTADO_ACADEMICO,
  EstadoAcademicoSchema,
} from './estado_academico.schema';
import {
  NIVEL_ACADEMICO,
  NivelAcademicoSchema,
} from './nivel_academico.schema';
import {
  TIPO_DE_ESTUDIANTE,
  TipoDeEstudianteSchema,
} from './tipo_de_estudiante.schema';
import { SeccionSchema } from './seccion.schema';
import { PersonaSchemaDTO } from './persona.schema';
import { MunicipioSchemaDTO } from './municipio.schema';
import { SeccionSchemaDTO } from './seccion.schema.dto';

export const EstudianteSchema = object({
  cedula: number(),
  fecha_de_inscripcion: nullish(date()),
  estado_academico: enum_(ESTADO_ACADEMICO),
  nivel_academico: enum_(NIVEL_ACADEMICO),
  tipo: enum_(TIPO_DE_ESTUDIANTE),
  seccion: nullish(SeccionSchema.entries.id),
  peso: nullish(number()),
  estatura: nullish(number()),
  chemise: nullish(number()),
  pantalon: nullish(number()),
  ultima_actualizacion: date(),
  municipio_de_nacimiento: string(),
  fecha_de_egreso: nullish(date()),
});

export type Estudiante = InferOutput<typeof EstudianteSchema>;

/* ................................... dto .................................. */

export const EstudianteSchemaDTO = object({
  ...PersonaSchemaDTO.entries,
  ...EstudianteSchema.entries,
  edad: pipe(number(), integer()),
  nivel_academico: NivelAcademicoSchema,
  estado_academico: EstadoAcademicoSchema,
  tipo: TipoDeEstudianteSchema,
  municipio_de_nacimiento: MunicipioSchemaDTO,
  seccion: nullish(SeccionSchemaDTO),
});

export type EstudianteDTO = InferOutput<typeof EstudianteSchemaDTO>;
