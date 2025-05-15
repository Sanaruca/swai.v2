import { createTRPCRouter } from '../../trpc';

import { obtener_estudiantes } from './usecase/query/obtener_estudiantes.usecase';
import { obtener_estudiante } from './usecase/query/obtener_estudiante.usecase';
import { registrar_estudiante } from './usecase/command/registrar_estudiante.usecase';
import { actualizar_estudiante } from './usecase/command/actualizar_estudiante.usecase';
import { eliminar_estudiante } from './usecase/command/eliminar_estudiante.usecase';

export const ESTUDIANTES_ROUTER = createTRPCRouter({
  obtener_estudiantes,
  obtener_estudiante,
  registrar_estudiante,
  actualizar_estudiante,
  eliminar_estudiante
});
