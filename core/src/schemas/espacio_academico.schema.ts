import {
  boolean,
  InferOutput,
  number,
  object,
  string,
  enum as enum_,
  integer,
  pipe,
  trim,
  array,
  minValue,
} from 'valibot';
import {
  TIPO_DE_ESPACIO_ACADEMICO,
  TipoDeEspacioAcademicoSchema,
} from './tipo_de_espacio_academico.schema';
import { RecursoSchema } from './recurso.schema';
import {
  ESTADO_DE_UN_RECURSO,
  EstadoDeUnRecursoSchema,
} from './estado_de_un_recurso.schema';

export const EspacioAcademicoSchema = object({
  id: number(),
  nombre: pipe(string(), trim()),
  tipo: enum_(TIPO_DE_ESPACIO_ACADEMICO),
  electricidad: boolean(),
  internet: boolean(),
  ventilacion: boolean(),
  capacidad: pipe(number(), integer()),
  metadata: object({
    slug: string(),
  }),
});

export type EspacioAcademico = InferOutput<typeof EspacioAcademicoSchema>;

/* .................................... . ................................... */

export const RecursoDeUnEspacioAcademicoSchema = object({
  id: number(),
  recurso: RecursoSchema.entries.id,
  espacio_academico: EspacioAcademicoSchema.entries.id,
  estado: enum_(ESTADO_DE_UN_RECURSO),
  cantidad: pipe(number(), integer(), minValue(0)),
});

export type RecursoDeUnEspacioAcademico = InferOutput<
  typeof RecursoDeUnEspacioAcademicoSchema
>;

export const RecursoDeUnEspacioAcademicoConRecursoSchemaDTO = object({
  ...RecursoDeUnEspacioAcademicoSchema.entries,
  recurso: RecursoSchema,
  estado: EstadoDeUnRecursoSchema,
});

export type RecursoDeUnEspacioAcademicoConRecursoDTO = InferOutput<
  typeof RecursoDeUnEspacioAcademicoConRecursoSchemaDTO
>;

/* ................................... dto .................................. */

export const EspacioAcademicoSchemaDTO = object({
  ...EspacioAcademicoSchema.entries,
  tipo: TipoDeEspacioAcademicoSchema,
  recursos: array(RecursoDeUnEspacioAcademicoConRecursoSchemaDTO),
});
export type EspacioAcademicoDTO = InferOutput<typeof EspacioAcademicoSchemaDTO>;
