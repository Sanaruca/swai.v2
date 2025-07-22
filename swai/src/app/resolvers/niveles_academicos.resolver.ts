import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NivelAcademico } from '@swai/core';

export const resolve_niveles_academicos: ResolveFn<NivelAcademico[]> = () => {
  return inject(
    ApiService
  ).client.institucion.obtener_niveles_academicos.query();
};
