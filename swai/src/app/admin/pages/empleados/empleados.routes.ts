import { ResolveFn, Route } from '@angular/router';
import { EmpleadosPageComponent } from './empleados.page.component';
import { inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { RegistrarEmpleadoPageComponent } from './registrar_empleado/registrar_empleado.page.component';
import { MenuItem } from 'primeng/api';
import { EstadosDeVenezuelaISO } from '@swai/core';
import { PerfilEmpleadoPageComponent } from './perfil_empleado/perfil_empleado.page.component';
import { resolve_niveles_academicos } from '../../../resolvers';

export const EMPLEADOS_ROUTES: Route[] = [
  {
    path: '',
    component: EmpleadosPageComponent,
    resolve: {
      cantidad_de_empleados: (() =>
        inject(
          ApiService
        ).client.empleados.obtener_cantidad_de_empleados.query()) as ResolveFn<any>,
      empleados: (() =>
        inject(
          ApiService
        ).client.empleados.obtener_empleados.query()) as ResolveFn<any>,
    },
  },
  {
    path: 'registrar',
    component: RegistrarEmpleadoPageComponent,
    resolve: {
      inputs: () => ({ modo: 'registrar' }),
      municipios: (() =>
        inject(ApiService).client.venezuela.obtener_municipios.query({
          por_estado: EstadosDeVenezuelaISO.MONAGAS,
        })) as ResolveFn<any>,
      parroquias: (() =>
        inject(ApiService).client.venezuela.obtener_parroquias.query({
          por_municipio: 'N-08', // Maturin
        })) as ResolveFn<any>,
      titulos_de_pregrado: (() =>
        inject(
          ApiService
        ).client.venezuela.obtener_titulos_de_pregrado.query()) as ResolveFn<any>,
      niveles_academicos: resolve_niveles_academicos,
      breadcrumb: ((_, state) => ({
        label: 'Registrar',
        routerLink: state.url,
      })) as ResolveFn<MenuItem>,
    },
  },
  {
    path: ':cedula',
    resolve: {
      empleado: ((r) =>
        inject(ApiService).client.empleados.obtener_empleado.query(
          +r.params['cedula']
        )) as ResolveFn<any>,
      breadcrumb: (async (r) => {
        const empleado = await inject(
          ApiService
        ).client.empleados.obtener_empleado.query(+r.params['cedula']);

        return {
          label:
            empleado.nombres.split(' ').at(0)! +
            ' ' +
            empleado.apellidos.split(' ').at(0),
          routerLink: ['/admin/empleados', empleado.cedula],
        };
      }) as ResolveFn<MenuItem>,
    },
    children: [
      {
        path: '',
        component: PerfilEmpleadoPageComponent,
      },
      {
        path: 'editar',
        component: RegistrarEmpleadoPageComponent,
        resolve: {
          inputs: () => ({ modo: 'editar' }),
          niveles_academicos: resolve_niveles_academicos,
          municipios: (() =>
            inject(ApiService).client.venezuela.obtener_municipios.query({
              por_estado: EstadosDeVenezuelaISO.MONAGAS,
            })) as ResolveFn<any>,
          parroquias: (() =>
            inject(ApiService).client.venezuela.obtener_parroquias.query({
              por_municipio: 'N-08', // Maturin
            })) as ResolveFn<any>,
          titulos_de_pregrado: (() =>
            inject(
              ApiService
            ).client.venezuela.obtener_titulos_de_pregrado.query()) as ResolveFn<any>,
          breadcrumb: ((_, state) => ({
            label: 'Editar',
            routerLink: state.url,
          })) as ResolveFn<MenuItem>,
        },
      },
    ],
  },
];
