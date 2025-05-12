import { createTRPCRouter } from '../../trpc';
import { obtener_cantidad_de_estudiantes_por_nivel_academico } from './usecase/query/obtener_cantidad_de_estudiantes_por_nivel_academico.usecase';
import { obtener_cantidad_de_estudiantes } from './usecase/query/obtener_cantidad_de_estudiantes.usecase';
import { obtener_pensum } from './usecase/query/obtener_pensum.usecase';
import { obtener_persona } from './usecase/query/obtener_persona.usecase';
import { obtener_niveles_academicos } from './usecase/query/obtener_niveles_academicos.usecase';
import { obtener_seccion_academica } from './usecase/query/obtener_seccion_academica.usecase';
import { obtener_registros_recientes } from './usecase/query/obtener_registros_recientes.usecase';
import { obtener_busqueda_rapida } from './usecase/query/obtener_busqueda_rapida.usecase';

export const INSTUTUCION_ROUTER = createTRPCRouter({
  obtener_cantidad_de_estudiantes_por_nivel_academico,
  obtener_cantidad_de_estudiantes,
  obtener_pensum,
  obtener_persona,
  obtener_niveles_academicos,
  obtener_seccion_academica,
  obtener_registros_recientes,
  obtener_busqueda_rapida
});
