import { ResolveFn, Route } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin.layout.component';
import { MenuItem } from 'primeng/api';
import { DashboardPageComponent } from './pages/dashboard/dashboard.page.component';
import {
  resolve_cantidad_de_estudiantes,
  resolve_institucion,
} from '../resolvers';
import { inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ConfiguracionPageComponent } from './pages/configuracion/configuracion.page.component';

export const ADMIN_ROUTES: Route[] = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'prefix',
      },
      {
        path: 'dashboard',
        component: DashboardPageComponent,
        resolve: {
          registros_recientes: () =>
            inject(
              ApiService
            ).client.institucion.obtener_registros_recientes.query(),
          cantidad_de_estudiantes: resolve_cantidad_de_estudiantes,
          cantidad_de_empleados: () =>
            inject(
              ApiService
            ).client.empleados.obtener_cantidad_de_empleados.query(),
          cantidad_de_espacios_academicos: () =>
            inject(
              ApiService
            ).client.espacios_academicos.obtener_cantidad_de_espacios_academicos.query(),
          cantidad_de_recursos: () =>
            inject(
              ApiService
            ).client.recursos.obtener_cantidad_de_recursos.query(),
          breadcrumb: ((route) => ({
            label: 'Vista Rápida',
            routerLink: [route.url.toString()],
          })) as ResolveFn<MenuItem>,
        },
      },
      {
        path: 'configuracion',
        component: ConfiguracionPageComponent,
        resolve: {
          institucion: resolve_institucion,
          breadcrumb: ((route) => ({
            label: 'Configuración',
            routerLink: [route.url.toString()],
          })) as ResolveFn<MenuItem>,
        },
      },
      {
        path: 'estudiantes',
        loadChildren: () =>
          import('./pages/estudiantes/estudiantes.routes').then(
            (m) => m.ESTUDIANTES_ROUTES
          ),
        resolve: {
          breadcrumb: ((route) => ({
            label: 'Estudiantes',
            routerLink: [route.url.toString()],
          })) as ResolveFn<MenuItem>,
        },
      },
      {
        path: 'empleados',
        loadChildren: () =>
          import('./pages/empleados/empleados.routes').then(
            (m) => m.EMPLEADOS_ROUTES
          ),
        resolve: {
          breadcrumb: ((route) => ({
            label: 'Empleados',
            routerLink: [route.url.toString()],
          })) as ResolveFn<MenuItem>,
        },
      },
      {
        path: 'niveles_academicos',
        loadChildren: () =>
          import('./pages/niveles_academicos/niveles_academicos.routes').then(
            (m) => m.NIVELES_ACADEMICOS_ROUTES
          ),
        resolve: {
          breadcrumb: ((route) => ({
            label: 'Niveles Académicos',
            routerLink: [route.url.toString()],
          })) as ResolveFn<MenuItem>,
        },
      },
      {
        path: 'espacios_academicos',
        loadChildren: () =>
          import('./pages/espacios_academicos/espacios_academicos.routes').then(
            (m) => m.ESPACIOS_ACADEMICOS_ROUTES
          ),
        resolve: {
          breadcrumb: ((route) => ({
            label: 'Espacios académicos',
            routerLink: [route.url.toString()],
          })) as ResolveFn<MenuItem>,
        },
      },
    ],
  },
];
