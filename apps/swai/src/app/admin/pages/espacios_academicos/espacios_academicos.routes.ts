import { ActivatedRouteSnapshot, ResolveFn, Route } from '@angular/router';
import { EspaciosAcademicosPageComponent } from './espacios_academicos.page.component';
import { inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { EspacioAcademicoPageComponent } from './espacio_academico/espacio_academico.page.component';
import { MenuItem } from 'primeng/api';
import { NotFoundPageComponent } from '../../../pages/not_found/not_found.page.component';

export const ESPACIOS_ACADEMICOS_ROUTES: Route[] = [
  {
    path: '',
    component: EspaciosAcademicosPageComponent,
    resolve: {
      cantidad_de_espacios_academicos: () =>
        inject(
          ApiService
        ).client.espacios_academicos.obtener_cantidad_de_espacios_academicos.query(),

      espacios_academicos: () =>
        inject(
          ApiService
        ).client.espacios_academicos.obtener_espacios_academicos.query(),
    },
  },
  {
    path: ':slug',
    component: EspacioAcademicoPageComponent,
    resolve: {
      cantidad_de_recursos: (route: ActivatedRouteSnapshot) =>
        inject(
          ApiService
        ).client.espacios_academicos.obtener_recursos_de_un_espacio_academico.query(
          { slug: route.paramMap.get('slug')! }
        ),

      espacio_academico: (route: ActivatedRouteSnapshot) => {
        return inject(
          ApiService
        ).client.espacios_academicos.obtener_espacio_academico.query({
          slug: route.paramMap.get('slug')!,
        });
      },
      breadcrumb: (async (route, state) => {
        const espacio_academico = await inject(
          ApiService
        ).client.espacios_academicos.obtener_espacio_academico.query({
          slug: route.paramMap.get('slug')!,
        });

        return {
          label: espacio_academico.nombre,
          routerLink: state.url,
        };
      }) as ResolveFn<MenuItem>,
    },
  },
];
