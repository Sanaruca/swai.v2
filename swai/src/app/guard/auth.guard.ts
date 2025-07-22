import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.snapshot.usuario) {
    return new RedirectCommand(router.parseUrl('/login'), {
      skipLocationChange: true,
    });
  }

  return true;
};
