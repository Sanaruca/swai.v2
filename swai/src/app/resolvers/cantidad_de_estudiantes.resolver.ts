import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CantidadDeEstudiantesDTO } from '@swai/server';
import { ApiService } from '../services/api.service';

export const resolve_cantidad_de_estudiantes: ResolveFn<
  CantidadDeEstudiantesDTO
> = () => {
  return inject(
    ApiService
  ).client.institucion.obtener_cantidad_de_estudiantes.query();
};
