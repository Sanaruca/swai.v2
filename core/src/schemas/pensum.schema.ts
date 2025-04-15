import { array, InferOutput, integer, number, object, pipe } from 'valibot';
import { NivelAcademicoSchema } from './nivel_academico.schema';
import { AreaDeFromacionSchema } from './area_de_formacion.schema';

export const PensumSchema = object({
  id: number(),
  nivel_academico: NivelAcademicoSchema.entries.numero,
  area_de_formacion: AreaDeFromacionSchema.entries.codigo,
  horas: pipe(number(), integer()),
});

export type Pensum = InferOutput<typeof PensumSchema>;

export const PensumSchemaDTO = object({
  nivel_academico: NivelAcademicoSchema,
  areas_de_formacion: array(
    object({
      ...AreaDeFromacionSchema.entries,
      horas: PensumSchema.entries.horas,
    })
  ),
});

export type PensumDTO = InferOutput<typeof PensumSchemaDTO>;
