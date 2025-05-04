import { ResolveFn, Route } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin.layout.component';
import { MenuItem } from 'primeng/api';
import { DashboardPageComponent } from './pages/dashboard/dashboard.page.component';

export const ADMIN_ROUTES: Route[] = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardPageComponent,
        resolve: {
          breadcrumb: ((route) => ({
            label: 'Vista Rápida',
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
