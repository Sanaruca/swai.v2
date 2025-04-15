import { Route } from '@angular/router';
import { LoginPageComponent } from './pages/login/login.page.component';

export const appRoutes: Route[] = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: '**',
    redirectTo: '/admin/niveles_academicos',
  },
];
