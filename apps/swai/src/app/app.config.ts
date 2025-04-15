import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection,
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
import { registerLocaleData } from '@angular/common';
import 'moment/locale/es';
import esVE from '@angular/common/locales/es-VE';
import { definePreset } from '@primeng/themes';
import { provideHttpClient, withFetch } from '@angular/common/http';
registerLocaleData(esVE);

export const appConfig: ApplicationConfig = {
  providers: [
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
