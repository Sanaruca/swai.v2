import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { TRPCRootRouter } from '@swai/server';
import type { UsuarioPayload, InstitucionDTO } from '@swai/core';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import cookieParser from 'cookie-parser';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import superjson from 'superjson';
import NodeCache from 'node-cache';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
app.use(cookieParser());

const cache = new NodeCache({ stdTTL: 3600 }); // TTL de 1 hora

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', async (req, res, next) => {
  console.log('Ejecutando middleware que identificara la usuar:');
  console.log('cookies:', req.cookies);
  console.log('headers:', req.headers);

  const request_context = {
    usuario: null as UsuarioPayload | null,
    access_token: null as string | null,
    institucion: null as InstitucionDTO | null,
  };

  const access_token = req.cookies['swai.auth']; // Captura la cookie de sesión

  request_context.access_token = access_token;
  const api = createTRPCClient<TRPCRootRouter>({
    links: [
      httpBatchLink({
        url: `${process.env['NX_API_URL']}/trpc`,
        transformer: superjson, // Usa superjson para serialización/deserialización
        headers: {
          authorization: `Bearer ${access_token}`, // Adjunta la cookie a la petición
        },
      }),
    ],
  });

  try {
    const usuario = await api.auth.whoami.query();
    console.log('Usuario detectado:', usuario);
    request_context.usuario = usuario;
  } catch {
    /* empty */
  }


  let institucion = cache.get<InstitucionDTO>('INSTITUCION') || null;

  if (!institucion) {
    try {
      institucion = await api.institucion.obtener_datos_de_la_institucion.query();
    } catch (err) {
      console.error('No se pudo obtener la institución:', err);
    }
    cache.set('INSTITUCION', institucion);
  }

  request_context.institucion = institucion;

  return angularApp
    .handle(req, request_context)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
