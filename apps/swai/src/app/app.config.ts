import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  makeStateKey,
  PLATFORM_ID,
  provideAppInitializer,
  provideZoneChangeDetection,
  TransferState,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import primelocale from 'node_modules/primelocale/es.json';
import { MessageService } from 'primeng/api';
import { isPlatformServer, registerLocaleData } from '@angular/common';
import 'moment/locale/es';
import esVE from '@angular/common/locales/es-VE';
import { definePreset } from '@primeng/themes';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { AppStateService } from './services/appstate.service';
import { AuthService } from './services/auth.service';
import { InstitucionDTO, UsuarioPayload } from '@swai/core';
registerLocaleData(esVE);

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      const app = inject(AppStateService);
      const auth = inject(AuthService);
      const api = inject(ApiService);

      const transfer_state = inject(TransferState);
      const platform = inject(PLATFORM_ID);

      const INSTITUCION = makeStateKey<InstitucionDTO>('INSTITUCION');
      const USUARIO = makeStateKey<UsuarioPayload>('USUARIO');

      const institucion = transfer_state.get(INSTITUCION, null);
      const usuario = transfer_state.get(USUARIO, null);

      const obtener_datos_de_la_institucion =
        api.client.institucion.obtener_datos_de_la_institucion;
      const whoami = api.client.auth.whoami;

      if (isPlatformServer(platform)) {

        return Promise.all([
          obtener_datos_de_la_institucion.query(),
          whoami.query().catch((error) => {
            console.warn("Error en appinitializer whoami:", error);
            return null; // o algún valor por defecto
          })
        ]).then(([institucion, usuario]) => {
          app.institucion = institucion;
          transfer_state.set(INSTITUCION, institucion);
        
          if (usuario) {
            auth.setUsuario(usuario);
            transfer_state.set(USUARIO, usuario)
          } else {
            // Opcional: manejar el caso cuando no hay usuario
          }
        
          return Promise.resolve();
        });
      }

      
      if (institucion) {
        app.institucion = institucion;
      }
      if (usuario) {
        auth.setUsuario(usuario);
      }

      if(!institucion){
        return obtener_datos_de_la_institucion.query().then(
          (institucion) => {
            app.institucion = institucion;
          }
        )
      }
      
      return Promise.resolve();

    }),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'es-VE' },
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: definePreset(Aura, {
          semantic: {
            primary: {
              50: '{orange.50}',
              100: '{orange.100}',
              200: '{orange.200}',
              300: '{orange.300}',
              400: '{orange.400}',
              500: '{orange.500}',
              600: '{orange.600}',
              700: '{orange.700}',
              800: '{orange.800}',
              900: '{orange.900}',
              950: '{orange.950}',
            },
          },
        }),
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities',
          },
        },
      },
      translation: primelocale.es,
    }),
    MessageService,
  ],
};
