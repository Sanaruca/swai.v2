import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  FastLinkComponent,
  InfoCardComponent,
} from '../../../../admin/components';
import {
  SexoTagComponent,
  EstadoAcademicoTagComponent,
  SeccionTagComponent,
  IllustrationComponent,
} from '../../../../common/components';
import { MomentModule } from 'ngx-moment';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Paginated } from '@swai/server';
import { EstudianteDTO, PensumDTO, SeccionDTO } from '@swai/core';
import { CantidadDeEstudiantesDTO } from '@swai/server';
import { ApiService } from '../../../../services/api.service';
import { NombrePipe } from '../../../../common/pipes/nombre.pipe';

@Component({
  selector: 'aw-seccion-academica.page',
  imports: [
    CommonModule,
    InputIconModule,
    IconFieldModule,
    InfoCardComponent,
    TableModule,
    AvatarModule,
    SexoTagComponent,
    EstadoAcademicoTagComponent,
    MomentModule,
    SeccionTagComponent,
    SkeletonModule,
    InputTextModule,
    ReactiveFormsModule,
    IllustrationComponent,
    TagModule,
    ButtonModule,
    MenuModule,
    TooltipModule,
    NombrePipe,
    FastLinkComponent,
  ],
  templateUrl: './seccion_academica.page.component.html',
  styleUrl: './seccion_academica.page.component.scss',
})
export class SeccionAcademicaPageComponent {
  /* ............................... injectables .............................. */
  private api = inject(ApiService);
  private router = inject(Router);
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

  /* ................................. estado ................................. */

  protected loading = false;
  protected busqueda_input = new FormControl<string>('');

  /* ................................. metodos ................................ */

  async busqueda(nombre: string) {
    this.loading = true;

    try {
      this.estudiantes =
        await this.api.client.estudiantes.obtener_estudiantes.query({
          por_nombre: nombre,
          por_secion: [this.seccion_academica.seccion],
          por_nivel_academico: [this.pensum.nivel_academico.numero],
          paginacion: {
            limit: this.estudiantes.limit,
          },
        });
    } finally {
      this.loading = false;
    }
  }

  async cargar_estudiantes(event: TableLazyLoadEvent) {
    // Parámetros de paginación
    const page = event.first! / event.rows!;
    const limit = event.rows!;

    if (page + 1 === this.estudiantes.page) return;

    this.loading = true;

    // Llamada a la API
    this.api.client.estudiantes.obtener_estudiantes
      .query({
        paginacion: { page: page + 1, limit },
        por_nivel_academico: [this.pensum.nivel_academico.numero],
        por_secion: [this.seccion_academica.seccion],
        por_nombre: this.busqueda_input.value || '',
      })
      .then((data) => {
        this.estudiantes = data;
      })
      .finally(() => (this.loading = false));
  }
  async navigateOnDoubleClick(comands: any[]) {
    await this.router.navigate(comands);
  }
}
