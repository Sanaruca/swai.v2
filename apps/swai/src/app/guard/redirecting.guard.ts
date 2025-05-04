import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ROL } from '@swai/core';
/**
 * @warning ¡Advertencia! esto puede generar bucles infinitos segun si las rutas a las cuales se
 * redirigira tienen este guardia registrado
 * 
 * TODO: Arreglar la advertencia
 * TODO: Arreglar las redirecciones al regargar
*/
export const redirectingGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const usuario = auth.snapshot.usuario;  
  

  if (!usuario) {
    if (state.url === '/login') {
      return true; // Prevent infinite loop if already on the login page
    }
    // Redirect to login if not logged in
    return new RedirectCommand(router.parseUrl('/login'), {
      onSameUrlNavigation: 'ignore'
    });
  }
  
  const rol = usuario.rol;
  
  // Redirect based on user role
  if (rol === ROL.ADMIN) {
    if (state.url === '/admin/estudiantes') {
      return true; // Prevent infinite loop if already on the login page
    }
    return new RedirectCommand(router.parseUrl('/admin/estudiantes'), {onSameUrlNavigation: 'ignore'});
  }

  return true;
};
