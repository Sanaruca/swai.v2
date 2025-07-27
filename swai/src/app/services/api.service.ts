import {
  Injectable,
  PLATFORM_ID,
  inject,
  REQUEST_CONTEXT,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private request_context = inject<{ access_token: string | null }>(
    REQUEST_CONTEXT,
    { optional: true }
  );
  private platform = inject(PLATFORM_ID);

  constructor() {
    this.client = createTRPCClient<TRPCRootRouter>({
      links: [
        httpBatchLink({
          url: API_BASE_URL + '/trpc',
          transformer: superjson,
          fetch: async (url, options) => {


            if (isPlatformBrowser(this.platform)) {
              // options = { ...options, credentials: 'include' };
              const response = await fetch(url, options);

              if (!response.ok) {
                const json = await response.clone().json();
                const error = json[0].error.json as TRPCErrorShape<
                  DefaultErrorData & {
                    swai_error: ISwaiError;
                  }
                >;
                this.toast.add({
                  severity: 'error',
                  summary: error.data.swai_error.mensaje,
                  detail:
                    error.data.swai_error.descripcion ||
                    `Tipo de error: "${error.data.swai_error.codigo}"`,
                });

                if (
                  error.data.swai_error.codigo ===
                  SwaiErrorCode.AUTENTICACION_USUARIO_NO_AUTENTICADO
                ) {
                  this.router.navigateByUrl('/login');
                }
              }

              return response;
            }
            return fetch(url, {
              ...options,
              headers: {
                ...options?.headers,
                Authorization: `Bearer ${this.request_context?.access_token}`,
              },
            });
          },
        }),
      ],
    });
  }
}
