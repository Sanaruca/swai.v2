import { createTRPCRouter } from '../../trpc';
import { actualizar_recurso_de_un_espacio_academico } from './usecase/command/actualizar_recurso_de_un_espacio_academico.usecase';
import { añadir_recurso } from './usecase/command/añadir_recurso.usecase';

export const RECURSOS_ROUTER = createTRPCRouter({
  añadir_recurso: añadir_recurso,
  actualizar_recurso_de_un_espacio_academico,
});
