import { date, enum_, InferOutput, object, pipe, regex, string } from 'valibot';
import { PersonaSchema, PersonaSchemaDTO } from './persona.schema';
import { CentroDeVotacionSchema } from './centro_de_votacion.schema';
import {
  TIPO_DE_EMPLEADO,
  TipoDeEmpleadoSchema,
} from './tipo_de_empleado.schema';
import { CedulaSchema } from './cedula.schema';

export const EmpleadoSchema = object({
  cedula: CedulaSchema,
  tipo_de_empleado: enum_(TIPO_DE_EMPLEADO),
  rif: string(),
  codigo_carnet_patria: pipe(
    string(),
    regex(/[0-9]+/, 'El codigo del carnet debe ser valido')
  ),
  centro_de_votacion: CentroDeVotacionSchema.entries.codigo,
  fecha_de_ingreso: date(),
});

export type Empleado = InferOutput<typeof EmpleadoSchema>;

export const EmpleadoSchemaDTO = object({
  ...PersonaSchemaDTO.entries,
  ...EmpleadoSchema.entries,
  tipo_de_empleado: TipoDeEmpleadoSchema,
  centro_de_votacion: CentroDeVotacionSchema,
});

export type EmpleadoDTO = InferOutput<typeof EmpleadoSchemaDTO>;
