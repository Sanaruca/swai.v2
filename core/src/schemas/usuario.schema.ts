import { custom, InferOutput, object, pick, pipe, string } from 'valibot';
import { CedulaSchema } from './cedula.schema';
import { PersonaSchemaDTO } from './persona.schema';

export const UsuarioSchema = object({
  id: string(),
  nombre_de_usuario: string(),
  clave: pipe(
    string(),
    custom(
      (v) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          v as string,
        ),
      'La clave debe tener al menos 8 caracteres, una letra mayuscula, una letra minuscula, un digito y un caracter especial',
    ),
  ),
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
