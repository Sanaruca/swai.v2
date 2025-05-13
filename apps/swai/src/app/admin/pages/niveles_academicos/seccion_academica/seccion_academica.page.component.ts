import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FastLinkComponent,
  InfoCardComponent,
} from '../../../../admin/components';
import { SeccionTagComponent } from '../../../../common/components';
import { MomentModule } from 'ngx-moment';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ActivatedRoute } from '@angular/router';
import { Paginated } from '@swai/server';
import { EstudianteDTO, PensumDTO, SeccionDTO, StringCondicion } from '@swai/core';
import { CantidadDeEstudiantesDTO } from '@swai/server';
import { NombrePipe } from '../../../../common/pipes/nombre.pipe';
import { TablaDeEstudiantesComponent } from '../../estudiantes/components/tabla_de_estudiantes/tabla_de_estudiantes.component';
import { Avatar } from 'primeng/avatar';
import { AsignarEstudiantesModalComponent } from './components/asignar_estudiantes/asignar_estudiantes.modal.component';
import { AñadirRecursoModalComponent } from "../../espacios_academicos/espacio_academico/components/a\u00F1adir_recurso/a\u00F1adir_recurso.modal.component";

@Component({
  selector: 'aw-seccion-academica.page',
  imports: [
    CommonModule,
    IconFieldModule,
    InfoCardComponent,
    MomentModule,
    SeccionTagComponent,
    SkeletonModule,
    InputTextModule,
    Avatar,
    TagModule,
    ButtonModule,
    MenuModule,
    NombrePipe,
    FastLinkComponent,
    TablaDeEstudiantesComponent,
    AsignarEstudiantesModalComponent,
    AñadirRecursoModalComponent
],
  templateUrl: './seccion_academica.page.component.html',
  styleUrl: './seccion_academica.page.component.scss',
})
export class SeccionAcademicaPageComponent {
  /* ............................... injectables .............................. */
  private route = inject(ActivatedRoute);

  /* .............................. data inicial .............................. */

  protected seccion_academica = this.route.snapshot.data[
    'seccion_academica'
  ] as SeccionDTO;
  protected estudiantes = this.route.snapshot.data[
    'estudiantes'
  ] as Paginated<EstudianteDTO>;
  protected pensum = this.route.snapshot.data['pensum'] as PensumDTO;
  protected cantidad_de_estudiantes = (
    this.route.snapshot.data[
      'cantidad_de_estudiantes'
    ] as CantidadDeEstudiantesDTO
  ).niveles_academicos[this.seccion_academica.nivel_academico - 1];

  /* ............................... constantes ............................... */

  protected StringCondicion = StringCondicion
}
