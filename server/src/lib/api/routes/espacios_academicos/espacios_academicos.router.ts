import { createTRPCRouter } from '../../trpc';
import { actualizar_espacio_academico } from './usecase/command/actualizar_espacio_academico.usecase';
import { eliminar_espacio_academico } from './usecase/command/eliminar_espacio_academico.usecase';
import { registrar_espacio_academico } from './usecase/command/registrar_espacio_academico.usecase';
import { obtener_cantidad_de_espacios_academicos } from './usecase/query/obtener_cantidad_de_espacios_academicos.usecase';
import { obtener_recursos_de_un_espacio_academico } from './usecase/query/obtener_recursos_de_un_espacio_academico.usecase';
import { obtener_espacio_academico } from './usecase/query/obtener_espacio_academico.usecase';
import { obtener_espacios_academicos } from './usecase/query/obtener_espacios_academicos.usecase';
import { obtener_salones_de_clase } from './usecase/query/obtener_salones_de_clase.usecase';

export const ESPACIOS_ACADEMICOS_ROUTER = createTRPCRouter({
  eliminar_espacio_academico,
  actualizar_espacio_academico,
  registrar_espacio_academico,
  obtener_recursos_de_un_espacio_academico,
  obtener_espacio_academico,
  obtener_espacios_academicos,
  obtener_cantidad_de_espacios_academicos,
  obtener_salones_de_clase,
});
