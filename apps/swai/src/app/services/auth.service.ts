import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
  makeStateKey,
  PLATFORM_ID,
  REQUEST_CONTEXT,
  TransferState
} from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioPayload, UsuarioPayloadSchema } from '@swai/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { type LoginDTO } from '@swai/server';
import { parse } from 'valibot';
import { ApiService } from './api.service';


const USER_KEY = makeStateKey<UsuarioPayload | null>('usuario');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #usuario!: BehaviorSubject<UsuarioPayload | null>;
  usuario!: Observable<UsuarioPayload | null>;
  snapshot!: {
    usuario: UsuarioPayload | null
  }

  /* ............................... injectables .............................. */
  private api = inject(ApiService);
  private ssr_request_context = inject<{ usuario: UsuarioPayload | null }>(
    REQUEST_CONTEXT
  );
  private router = inject(Router);
  private http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);

  /* ................................. estado ................................. */

  constructor() {

    if (isPlatformBrowser(this.platformId)) {
      const usuario = this.transferState.get<UsuarioPayload | null>(USER_KEY, null);

      console.log('usuario from inicializacion browser', usuario);
      this.#usuario = new BehaviorSubject<UsuarioPayload | null>(usuario)
      
    }
    
    if (isPlatformServer(this.platformId)) {
      const usuario = this.ssr_request_context.usuario;
      
      console.log('usuario from inicializacion server', usuario);
      this.#usuario = new BehaviorSubject<UsuarioPayload | null>(usuario)

      if (usuario) {
        this.transferState.set<UsuarioPayload | null>(USER_KEY, usuario);
      }
    }

    
    this.usuario = this.#usuario.asObservable();
    this.snapshot = {
      usuario:  this.#usuario.value
    }
  }

  async login(data: LoginDTO) {
    try {
      const usuario = await this.api.client.auth.login.mutate(data);
      this.setSession(usuario);
      this.router.navigate(['/admin/estudiantes']);
    } catch (error) {
      console.error('Login failed', error);
    }
  }

  logout() {
    this.http.post('/api/logout', {}).subscribe({
      next: () => {
        this.setSession(null);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      },
    });
  }

  protected setSession(usuario: UsuarioPayload | null) {
    if (usuario) {
      sessionStorage.setItem('swai_user', JSON.stringify(usuario));
    } else {
      sessionStorage.removeItem('swai_user');
    }

    this.#usuario.next(usuario);
    this.snapshot.usuario = usuario
  }
}
