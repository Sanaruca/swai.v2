import { createTRPCRouter } from '../../trpc';
import { whoami } from './usecase/query/whoami.usecase';
import { login } from './usecase/command/login.usecase';
import { cambiar_clave } from './usecase/command/cambiar_clave.usecase';
import { actualizar_usuario } from './usecase/command/actualizar_usuario.usecase';
import { validar_token } from './usecase/query/validar_token.usecase';

export const AUTH_ROUTER = createTRPCRouter({
  login,
  whoami,
  cambiar_clave,
  actualizar_usuario,
  validar_token,
});
