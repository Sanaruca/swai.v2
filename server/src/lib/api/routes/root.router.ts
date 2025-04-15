import { createTRPCRouter } from '../trpc';
import { EMPLEADOS_ROUTER } from './empleados/empleados.router';
import { ESPACIOS_ACADEMICOS_ROUTER } from './espacios_academicos/espacios_academicos.router';
import { ESTUDIANTES_ROUTER } from './estudiantes/estudiantes.router';
import { INSTUTUCION_ROUTER } from './institucion/institucion.router';
import { RECURSOS_ROUTER } from './recursos/recursos.router';
import { VENEZUELA_ROUTER } from './venezuela/venezuela.router';

export const ROOT_ROUTER = createTRPCRouter({
  venezuela: VENEZUELA_ROUTER,
  institucion: INSTUTUCION_ROUTER,
  espacios_academicos: ESPACIOS_ACADEMICOS_ROUTER,
  estudiantes: ESTUDIANTES_ROUTER,
  empleados: EMPLEADOS_ROUTER,
  recursos: RECURSOS_ROUTER,
});
// export type definition of API
export type TRPCRootRouter = typeof ROOT_ROUTER;
