import { Component, inject, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { Paginated } from '@swai/server';
import {
  EstudianteDTO,
  generar_listado_de_estudiantes,
  NIVEL_ACADEMICO_CARDINAL_MAP,
  NIVELES_ACADEMICOS_MAP,
  PensumDTO,
  SeccionDTO,
  StringCondicion,
} from '@swai/core';
import { CantidadDeEstudiantesDTO } from '@swai/server';
import { NombrePipe } from '../../../../common/pipes/nombre.pipe';
import { TablaDeEstudiantesComponent } from '../../estudiantes/components/tabla_de_estudiantes/tabla_de_estudiantes.component';
import { Avatar } from 'primeng/avatar';
import { AsignarEstudiantesModalComponent } from './components/asignar_estudiantes/asignar_estudiantes.modal.component';
import { AñadirRecursoModalComponent } from '../../espacios_academicos/espacio_academico/components/a\u00F1adir_recurso/a\u00F1adir_recurso.modal.component';
import { MenuItem } from 'primeng/api';
import { ApiService } from '../../../../services/api.service';

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
    AñadirRecursoModalComponent,
  ],
  templateUrl: './seccion_academica.page.component.html',
  styleUrl: './seccion_academica.page.component.scss',
})
export class SeccionAcademicaPageComponent implements OnInit {
  /* ............................... injectables .............................. */
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);

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
  ).niveles_academicos[this.seccion_academica.nivel_academico - 1].secciones.find(seccion => seccion.id === this.seccion_academica.id)!;

  /* ............................... constantes ............................... */

  protected NIVEL_ACADEMICO_MAP = NIVELES_ACADEMICOS_MAP
  protected NIVEL_ACADEMICO_CARDINAL_MAP = NIVEL_ACADEMICO_CARDINAL_MAP

  protected StringCondicion = StringCondicion;

  protected imprimir_menu: MenuItem[] = [
    {
      label: 'Listado',
      icon: 'pi pi-list',
      command: () => {
        this.api.client.estudiantes.obtener_estudiantes
          .query({
            filtros: [
              {
                campo: 'seccion',
                condicion: StringCondicion.IGUAL,
                valor: this.seccion_academica.id,
              },
            ],
            paginacion: {
              page: 1,
              limit: 100,
            },
          })
          .then((r) =>
            generar_listado_de_estudiantes(
              r.data,
              `Lista de estudiantes de ${
                NIVEL_ACADEMICO_CARDINAL_MAP[this.seccion_academica.nivel_academico as 1 | 2 | 3 | 4 | 5 ]
              } Año seccion "${this.seccion_academica.seccion}"`
            )
          );
      },
    },
  ];

  /* .............................. ciclo de vida ............................. */

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.seccion_academica = data['seccion_academica'] as SeccionDTO;
      this.estudiantes = data['estudiantes'] as Paginated<EstudianteDTO>;
      this.pensum = data['pensum'] as PensumDTO;
      this.cantidad_de_estudiantes = (
        data['cantidad_de_estudiantes'] as CantidadDeEstudiantesDTO
      ).niveles_academicos[this.seccion_academica.nivel_academico - 1].secciones.find(seccion => seccion.id === this.seccion_academica.id)!;
    });
  }

  /* ................................. metodos ................................ */

  recargar() {
    this.router.navigate([this.router.url], { onSameUrlNavigation: 'reload' });
  }
}
