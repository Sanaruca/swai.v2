import { ResolveFn, Route } from '@angular/router';
import { RegistrarEstudiantePageComponent } from './registrar_estudiante/registrar_estudiante.page.component';
import { inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { PerfilEstudiantePageComponent } from './perfil_estudiante/perfil_estudiante.page.component';
import { EstudianteDTO } from '@swai/core';
import {
  resolve_cantidad_de_estudiantes,
  resolve_niveles_academicos,
} from '../../../resolvers';
import { MenuItem } from 'primeng/api';
import { EstudiantesPageComponent } from './estudiantes.page.component';

export const ESTUDIANTES_ROUTES: Route[] = [
  {
    path: '',
    component: EstudiantesPageComponent,
    resolve: {
      cantidad_de_estudiantes: resolve_cantidad_de_estudiantes,
      estudiantes: (() =>
        inject(ApiService).client.estudiantes.obtener_estudiantes.query({
          paginacion: { limit: 5 },
        })) as ResolveFn<any>,
    },
  },
  {
    path: 'registrar',
    component: RegistrarEstudiantePageComponent,
    resolve: {
      niveles_academicos: resolve_niveles_academicos,
      breadcrumb: ((_, state) => ({
        label: 'Registrar',
        routerLink: state.url,
      })) as ResolveFn<MenuItem>,
      inputs: () => ({
        modo: 'registro',
      }),
    },
  },
  {
    path: ':cedula',
    resolve: {
      estudiante: ((r) => {
        return inject(ApiService).client.estudiantes.obtener_estudiante.query(
          +r.params['cedula']
        );
      }) as ResolveFn<EstudianteDTO>,
      breadcrumb: (async (r, state) => {
        const estudiante = await inject(
          ApiService
        ).client.estudiantes.obtener_estudiante.query(+r.params['cedula']);

        return {
          label:
            estudiante.nombres.split(' ').at(0)! +
            ' ' +
            estudiante.apellidos.split(' ').at(0),
          routerLink: ['/admin/estudiantes', estudiante.cedula],
        };
      }) as ResolveFn<MenuItem>,
    },
    children: [
      {
        component: PerfilEstudiantePageComponent,
        path: '',
        resolve: {},
      },
      {
        component: RegistrarEstudiantePageComponent,
        path: 'editar',
        resolve: {
          niveles_academicos: resolve_niveles_academicos,
          inputs: () => ({ modo: 'editar' }),
          breadcrumb: ((_, state) => ({
            label: 'Editar',
            routerLink: state.url,
          })) as ResolveFn<MenuItem>,
        },
      },
    ],
  },
];
