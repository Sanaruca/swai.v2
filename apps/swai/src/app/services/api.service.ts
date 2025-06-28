import { Injectable, Inject, PLATFORM_ID, inject, REQUEST_CONTEXT } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { TRPCRootRouter } from '@swai/server';
import { environment } from '../../environments/environment';
import superjson from 'superjson';
import { MessageService } from 'primeng/api';
import type {
  DefaultErrorData,
  TRPCErrorShape,
} from '@trpc/server/unstable-core-do-not-import';
import { ISwaiError, SwaiErrorCode } from '@swai/core';
import { Router } from '@angular/router';

const API_BASE_URL = `${environment.SWAI_BASE_URL}/api`;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  client;
  private toast = inject(MessageService);
  private router = inject(Router);
  private request_context = inject<{access_token: string | null}>(REQUEST_CONTEXT, {optional: true});

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.client = createTRPCClient<TRPCRootRouter>({
      links: [
        httpBatchLink({
          url: API_BASE_URL + '/trpc',
          transformer: superjson,
          fetch: async (url, options) => {
            
            // Verificar si estamos en el cliente o en el servidor
            if (isPlatformServer(this.platformId)) {
              options = {...options, headers: {...options?.headers, authorization: `Bearer ${this.request_context?.access_token}`}};
              return fetch(url, options);
            }
            
            if (isPlatformBrowser(this.platformId)) {
              options = {...options, credentials: 'include'};
              const response = await fetch(url, options);

              if (!response.ok) {
                const json = await response.clone().json();
                const error = json[0].error.json as TRPCErrorShape<
                  DefaultErrorData & {
                    swai_error: ISwaiError;
                  }
                >;
                console.error('Error en la solicitud:', error);
                this.toast.add({
                  severity: 'error',
                  summary: error.data.swai_error.mensaje,
                  detail:
                    error.data.swai_error.descripcion ||
                    `Tipo de error: "${error.data.swai_error.codigo}"`,
                });

                if (error.data.swai_error.codigo === SwaiErrorCode.AUTENTICACION_USUARIO_NO_AUTENTICADO){
                  this.router.navigateByUrl('/login')
                }

              }

              return response;
            }

            // Caso por defecto (si no se detecta la plataforma)
            return Promise.reject(
              new Error('No se pudo determinar la plataforma')
            );
          },
        }),
      ],
    });
  }
}
