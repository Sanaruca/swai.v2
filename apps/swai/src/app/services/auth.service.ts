import {
  inject,
  Injectable,
  PLATFORM_ID
} from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioPayload } from '@swai/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { type LoginDTO } from '@swai/server';
import { ApiService } from './api.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /* ............................... injectables .............................. */
  private api = inject(ApiService);
  private router = inject(Router);
  private platform = inject(PLATFORM_ID);
  
  #usuario = new BehaviorSubject<UsuarioPayload | null>(null);
  get usuario(): Observable<UsuarioPayload | null> {
    return this.#usuario.asObservable();
  }

  set usuario(usuario: UsuarioPayload | null) {
    this.setSession(usuario);
  }

  get snapshot(): {
    usuario: UsuarioPayload | null
  } {
    return {
      usuario: this.#usuario.value
    }
  }

  
  /* ................................. estado ................................. */

  async login(data: LoginDTO) {
    try {
      const usuario = await this.api.client.auth.login.mutate(data);
      this.setSession(usuario);
      this.router.navigate(['/admin/dashboard']);
    } catch (error) {
      console.error('Login failed', error);
    }
  }

  logout() {
    this.setSession(null);
    this.router.navigate(['/login']);
  }

  setUsuario(usuario: UsuarioPayload | null){
    this.setSession(usuario);
  }

  /**
   * @private
   * @param usuario 
   */
  private setSession(usuario: UsuarioPayload | null) {
    if (usuario && isPlatformBrowser(this.platform)) {
      sessionStorage.setItem('swai_user', JSON.stringify(usuario));
    } else if (!usuario && isPlatformBrowser(this.platform)) {
      sessionStorage.removeItem('swai_user');
      document.cookie = 'swai.auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    }

    this.#usuario.next(usuario);
  }
}
