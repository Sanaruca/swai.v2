import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ROL } from '@swai/core';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  if (auth.snapshot.usuario && auth.snapshot.usuario.rol !== ROL.ADMIN) {
    return false;
  }
  return true;
};
