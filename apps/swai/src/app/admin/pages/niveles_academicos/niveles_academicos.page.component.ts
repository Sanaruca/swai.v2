import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FastLinkComponent,
  InfoCardComponent,
} from '../../../admin/components';
import { PensumDTO } from '@swai/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CantidadDeEstudiantesDTO } from '@swai/server';
import { TagModule } from 'primeng/tag';
import { obtener_color_seccion_class } from './utils';

@Component({
  selector: 'aw-niveles-academicos.page',
  imports: [
    CommonModule,
    FastLinkComponent,
    TagModule,
    InfoCardComponent,
    RouterLink,
  ],
  templateUrl: './niveles_academicos.page.component.html',
  styleUrl: './niveles_academicos.page.component.scss',
})
export class NivelesAcademicosPageComponent {
  private route = inject(ActivatedRoute);
  protected pensum: PensumDTO[] = this.route.snapshot.data['pensum'];
  protected cantidad_de_estudiantes: CantidadDeEstudiantesDTO =
    this.route.snapshot.data['cantidad_de_estudiantes'];

  protected obtener_cantidad_de_estudiantes_por_nivel_academico(
    nivel_academico: number
  ): CantidadDeEstudiantesDTO['niveles_academicos'][0] {
    return this.cantidad_de_estudiantes.niveles_academicos.find(
      (it) => it.numero === nivel_academico
    )!;
  }

  protected obtener_color_seccion_class(seccion: string, contraste = false) {
    return obtener_color_seccion_class(seccion, contraste);
  }
}
