import { InferOutput, object, pipe, string, toUpperCase, trim } from 'valibot';

export const RolSchema = object({
  nombre: pipe(string(), toUpperCase(), trim()),
  descripcion: string(),
});

export type Rol = InferOutput<typeof RolSchema>;

export enum ROL {
  ADMIN = 'ADMIN',
}

export const ROLES: Rol[] = [
  {
    nombre: 'ADMIN',
    descripcion: 'Administrador(a) de sistema',
  },
] as const;
