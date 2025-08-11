import { Route } from '@angular/router';
import { LoginPageComponent } from './pages/login/login.page.component';
import { NotFoundPageComponent } from './pages/not_found/not_found.page.component';
import { authGuard } from './guard/auth.guard';
import { adminGuard } from './guard/admin.guard';
import { redirectingGuard } from './guard/redirecting.guard';
import { MainPageComponent } from './pages/main/main.page.component';
import { RecuperarClavePageComponent } from './pages/recuperar_clave/recuperar_clave.page.component';
import { CambiarClavePageComponent } from './pages/cambiar_clave/cambiar_clave.page.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'login',
    canActivate: [redirectingGuard],
    component: LoginPageComponent,
  },
  {
    path: 'recuperar_clave',
    component: RecuperarClavePageComponent,
  },
  {
    path: 'recuperar_cuenta',

    component: CambiarClavePageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
