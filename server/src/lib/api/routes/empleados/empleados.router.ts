import { createTRPCRouter } from '../../trpc';
import { registrar_empleado } from './usecase/command/registrar_empleado.usecase';
import { obtener_empleados } from './usecase/query/obtener_empleados.usecase';
import { obtener_cantidad_de_empleados } from './usecase/query/obtener_cantidad_de_empleados.usecase';
import { obtener_empleado } from './usecase/query/obtener_empleado.usecase';
import { actualizar_empelado } from './usecase/command/actualizar_empleado.usecase';
import { eliminar_empleado } from './usecase/command/eliminar_empleado.usecase';

export const EMPLEADOS_ROUTER = createTRPCRouter({
  registrar_empleado,
  obtener_cantidad_de_empleados,
  obtener_empleado,
  obtener_empleados,
  actualizar_empelado,
  eliminar_empleado
});
