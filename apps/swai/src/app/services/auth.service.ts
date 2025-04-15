import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioPayload, UsuarioPayloadSchema } from '@swai/core';
import { BehaviorSubject } from 'rxjs';
import { parse } from 'valibot';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /* ............................... injectables .............................. */
  private router = inject(Router);
  private http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  /* ................................. estado ................................. */
  
  constructor() {

    if(isPlatformBrowser(this.platformId)){ 
      console.log('browser'); 
      
      const usuario_json = sessionStorage.getItem('swai_user');
      
      if (usuario_json) {
        const usuario = parse(UsuarioPayloadSchema, JSON.parse(usuario_json));
        this.#usuario.next(usuario);
      }
    }

  }

  #usuario = new BehaviorSubject<UsuarioPayload | null>(null);
  usuario = this.#usuario.asObservable();

  login(data: {username: string, password: string}) {
    this.http.post<{mensaje: string, usuario: UsuarioPayload}>('/api/login', data).subscribe({
      next: (response) => {
        sessionStorage.setItem('swai_user', JSON.stringify(response.usuario));
        this.#usuario.next(response.usuario);
        this.router.navigate(['/admin/estudiantes']);
      },
      error: (error) => {
        console.error('Login failed', error);
      },
    });
  }
  
  logout() {
    this.http.post('/api/logout', {}).subscribe({
      next: () => {
        sessionStorage.removeItem('swai_user');
        this.#usuario.next(null);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      },
    });
  }


}
