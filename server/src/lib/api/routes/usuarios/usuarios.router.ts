import { createTRPCRouter } from '../../trpc';
import { recuperar_clave } from './usecase/command/recuperar_clave.usecase';
import { restablecer_clave } from './usecase/command/restablecer_clave.usecase';

export const USUARIOS_ROUTER = createTRPCRouter({
  recuperar_clave,
  restablecer_clave,
});
