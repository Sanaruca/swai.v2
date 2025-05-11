import { ActivatedRouteSnapshot, ResolveFn, Route } from '@angular/router';
import { NivelesAcademicosPageComponent } from './niveles_academicos.page.component';
import {
  resolve_cantidad_de_estudiantes,
  resolve_pensum,
} from '../../../resolvers';
import { CantidadDeEstudiantesPorNivelAcademicoDTO, Paginated } from '@swai/server';
import { inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { NivelAcademicoPageComponent } from './nivel_academico/nivel_academico.page.component';
import { MenuItem } from 'primeng/api';
import { EstudianteDTO, NIVELES_ACADEMICOS, SeccionDTO } from '@swai/core';
import { SeccionAcademicaPageComponent } from './seccion_academica/seccion_academica.page.component';

export const NIVELES_ACADEMICOS_ROUTES: Route[] = [
  {
    path: '',
    component: NivelesAcademicosPageComponent,
    resolve: {
      cantidad_de_estudiantes: resolve_cantidad_de_estudiantes,
      pensum: resolve_pensum(),
    },
  },
  {
    path: ':nivel_academico',
    children: [
      {
        path: '',
        component: NivelAcademicoPageComponent,
        resolve: {
          estudiantes: (route: ActivatedRouteSnapshot) =>
            inject(ApiService).client.estudiantes.obtener_estudiantes.query({
              por_nivel_academico: [+route.paramMap.get('nivel_academico')!],
            }),
          cantidad_de_estudiantes: ((route) => {
            return inject(
              ApiService
            ).client.institucion.obtener_cantidad_de_estudiantes_por_nivel_academico.query(
              +route.paramMap.get('nivel_academico')!
            );
          }) as ResolveFn<CantidadDeEstudiantesPorNivelAcademicoDTO>,
          pensum: ((r) =>
            resolve_pensum(
              +r.paramMap.get('nivel_academico')!
            )()) as ResolveFn<any>,
        },
      },
      {
        path: ':seccion',
        component: SeccionAcademicaPageComponent,
        resolve: {
          cantidad_de_estudiantes: resolve_cantidad_de_estudiantes,
          pensum: async (r: ActivatedRouteSnapshot) =>
            await resolve_pensum(+r.paramMap.get('nivel_academico')!)(),
          seccion_academica: ((r) =>
            inject(
              ApiService
            ).client.institucion.obtener_seccion_academica.query({
              nivel_academico: +r.paramMap.get('nivel_academico')!,
              seccion: r.paramMap.get('seccion')!,
            })) as ResolveFn<SeccionDTO>,
          estudiantes: ((r) =>
            inject(ApiService).client.estudiantes.obtener_estudiantes.query({
              por_nivel_academico: [+r.paramMap.get('nivel_academico')!],
              por_secion: [r.paramMap.get('seccion')!.toUpperCase()],
            })) as ResolveFn<Paginated<EstudianteDTO>>,
          breadcrumb: ((r, state) => {
            return {
              label: `Seccion ${r.paramMap.get('seccion')!.toUpperCase()}`,
              routerLink: [state.url],
            };
          }) as ResolveFn<MenuItem>,
        },
      },
    ],
    resolve: {
      breadcrumb: ((r, state) => {
        return {
          label:
            NIVELES_ACADEMICOS.at(+r.paramMap.get('nivel_academico')! - 1)
              ?.nombre ?? 'error',
          routerLink: [state.url],
        };
      }) as ResolveFn<MenuItem>,
    },
  },
];
