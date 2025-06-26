import { ResolveFn } from "@angular/router";
import { ApiService } from "../services/api.service";
import { InstitucionDTO } from "@swai/core";
import { inject } from "@angular/core";

export const resolve_institucion: ResolveFn<InstitucionDTO> = () => {
  return inject(ApiService).client.institucion.obtener_datos_de_la_institucion.query()
}