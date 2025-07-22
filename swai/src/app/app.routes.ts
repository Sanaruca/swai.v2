import { Route } from '@angular/router';
import { LoginPageComponent } from './pages/login/login.page.component';
import { NotFoundPageComponent } from './pages/not_found/not_found.page.component';
import { adminGuard } from './guard/admin.guard';
import { redirectingGuard } from './guard/redirecting.guard';
import { MainPageComponent } from './pages/main/main.page.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: MainPageComponent,
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
    component: NotFoundPageComponent,
  },
];
