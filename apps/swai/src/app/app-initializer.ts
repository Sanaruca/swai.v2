import { isPlatformServer } from "@angular/common";
import { inject, TransferState, PLATFORM_ID, makeStateKey } from "@angular/core";
import { InstitucionDTO, UsuarioPayload } from "@swai/core";
import { ApiService } from "./services/api.service";
import { AppStateService } from "./services/appstate.service";
import { AuthService } from "./services/auth.service";
import { Observable } from "rxjs";

export const app_initializer: () => Observable<void> | Promise<void> | void = () => {
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
      }).catch((error) => {
        console.warn("Error en appinitializer:", error);
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
      ).catch(
        (error) => {
          console.error("Error en appinitializer obtener_datos_de_la_institucion:", error);
          return Promise.resolve();
        }
      )
    }
    
    return Promise.resolve();

  }
