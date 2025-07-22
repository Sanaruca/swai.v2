import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiService } from '../services/api.service';
import { PensumDTO } from '@swai/core';

export function resolve_pensum(): () => Promise<PensumDTO[]>;
export function resolve_pensum(
  nivel_academico: number
): () => Promise<PensumDTO>;
export function resolve_pensum(
  nivel_academico?: number
): ResolveFn<PensumDTO | PensumDTO[]> {
  return async () => {
    const api = inject(ApiService).client;

    const pensum = await api.institucion.obtener_pensum.query(
      nivel_academico ? { nivel_academico } : undefined
    );

    return pensum;
  };
}
