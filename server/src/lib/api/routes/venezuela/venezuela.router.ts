import { createTRPCRouter } from '../../trpc';
import { obtener_municipios } from './usecase/query/obtener_municipios.usecase';
import { obtener_parroquias } from './usecase/query/obtener_parroquias.usecase';
import { obtener_centros_de_votacion } from './usecase/query/obtener_centros_de_votacion.usecase';
import { obtener_titulos_de_pregrado } from './usecase/query/obtener_titulos_de_pregrado.usecase';
import { obtener_plantel_educativo } from './usecase/query/obtener_plantel_educativo.usecase';

export const VENEZUELA_ROUTER = createTRPCRouter({
  obtener_municipios,
  obtener_parroquias,
  obtener_centros_de_votacion,
  obtener_titulos_de_pregrado,
  obtener_plantel_educativo,
});
