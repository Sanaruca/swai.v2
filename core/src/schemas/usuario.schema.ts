import { InferOutput, object, pick, string } from 'valibot';
import { CedulaSchema } from './cedula.schema';
import { PersonaSchemaDTO } from './persona.schema';

export const UsuarioSchema = object({
  id: string(),
  nombre_de_usuario: string(),
  clave: string(),
  rol: string(),
  cedula: CedulaSchema,
});

export type Usuario = InferOutput<typeof UsuarioSchema>;

export const UsuarioSchemaDTO = object({
  ...pick(PersonaSchemaDTO, [
    'cedula',
    'nombres',
    'apellidos',
    'correo',
    'direccion',
    'sexo',
    'telefono',
  ]).entries,
  ...pick(UsuarioSchema, ['id', 'nombre_de_usuario', 'rol']).entries,
});

export type UsuarioDTO = InferOutput<typeof UsuarioSchemaDTO>;

export const UsuarioPayloadSchema = pick(UsuarioSchema, [
  'id',
  'nombre_de_usuario',
  'cedula',
  'rol',
]);

export type UsuarioPayload = InferOutput<typeof UsuarioPayloadSchema>;
