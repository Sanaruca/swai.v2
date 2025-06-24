import { date, InferOutput, nullable, object, string } from 'valibot';
import { PlantelEducativoSchema } from './plantel_educativo.schema';
import { MunicipioSchema, MunicipioSchemaDTO } from './municipio.schema';

export const InstitucionSchema = object({
  nombre: string(),
  codigo: string(),
  rif: string(),
  direccion: nullable(string()),
  telefono: nullable(string()),
  correo: nullable(string()),
  fecha_de_fundacion: nullable(date()),
  ultima_actualizacion: date(),
  plantel_educativo: string(),
  municipio: MunicipioSchema.entries.codigo,
  periodo_academico_actual: string(),
  inicio_de_periodo_academico: date(),
  fin_de_periodo_academico: date(),
});

export type Institucion = InferOutput<typeof InstitucionSchema>;

export const InstitucionSchemaDTO = object({
  ...InstitucionSchema.entries,
  municipio: MunicipioSchemaDTO,
  plantel_educativo: PlantelEducativoSchema,
});

export type InstitucionDTO = InferOutput<typeof InstitucionSchemaDTO>;
