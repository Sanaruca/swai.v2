import { InferOutput, object, pick, string } from 'valibot';
import { CedulaSchema } from './cedula.schema';

export const UsuarioSchema = object({
  id: string(),
  nombre_de_usuario: string(),
  clave: string(),
  rol: string(),
  cedula: CedulaSchema,
});

export type Usuario = InferOutput<typeof UsuarioSchema>;

export const UsuarioPayloadSchema = pick(
  UsuarioSchema,
  ['id', 'nombre_de_usuario', 'cedula', 'rol']
);

export type UsuarioPayload = InferOutput<typeof UsuarioPayloadSchema>;