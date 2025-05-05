import { Route } from '@angular/router';
import { LoginPageComponent } from './pages/login/login.page.component';
import { NotFoundPageComponent } from './pages/not_found/not_found.page.component';
import { adminGuard } from './guard/admin.guard';
import { redirectingGuard } from './guard/redirecting.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'login',
    canActivate: [redirectingGuard],
    component: LoginPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent
  },
];
