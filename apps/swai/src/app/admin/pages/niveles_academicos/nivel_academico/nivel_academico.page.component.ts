import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CantidadDeEstudiantesPorNivelAcademicoDTO, Paginated } from '@swai/server';
import { InfoCardComponent } from '../../../../admin/components';
import {
  ColorSeccion,
  ESTADO_ACADEMICO,
  generar_listado_de_estudiantes,
  NIVEL_ACADEMICO_CARDINAL_MAP,
  NumberCondicion,
  PensumDTO,
  SeccionDTO,
  StringCondicion,
} from '@swai/core';
import { TableModule } from 'primeng/table';
import { MomentModule } from 'ngx-moment';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { TablaDeEstudiantesComponent } from '../../estudiantes/components/tabla_de_estudiantes/tabla_de_estudiantes.component';
import { obtener_color_seccion_class } from '../utils/info_card_seccion_color.util';
import { MenuItem, MessageService } from 'primeng/api';
import { ApiService } from '../../../../services/api.service';
import { PromoverNivelAcademicoModalComponent } from './components/promover_nivel_academico/promover_nivel_academico.modal.component';
import { PensumModalComponent } from './components/pensum/pensum.modal.component';
import { Avatar } from 'primeng/avatar';
import { NombrePipe } from '../../../../common/pipes/nombre.pipe';

@Component({
  selector: 'aw-nivel-academico.page',
  imports: [
    CommonModule,
    InputIconModule,
    IconFieldModule,
    InfoCardComponent,
    TableModule,
    MomentModule,
    TagModule,
    ButtonModule,
    MenuModule,
    TooltipModule,
    TablaDeEstudiantesComponent,
    MenuModule,
    RouterLink,
    PromoverNivelAcademicoModalComponent,
    PensumModalComponent,
    Avatar,
    NombrePipe
  ],
  templateUrl: './nivel_academico.page.component.html',
  styleUrl: './nivel_academico.page.component.scss',
})
export class NivelAcademicoPageComponent {
  /* ............................... injectables .............................. */
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private toast = inject(MessageService);

  /* .................................. state ................................. */

  protected loadings = {
    imprimir: false,
  }

  /* ................................ constants ............................... */

  NIVEL_ACADEMICO = +this.route.snapshot.paramMap.get('nivel_academico')!;
  protected NIVEL_ACADEMICO_CARDINAL_MAP = NIVEL_ACADEMICO_CARDINAL_MAP;
  protected NumberCondicion = NumberCondicion;
  protected acciones_menu: MenuItem[] = [
    {
      label: 'Ver pensum',
      icon: 'pi pi-eye',
      command: () => {
        this.pensum_modal().open();
      },
    },
    {
      label: 'Promover',
      icon: 'pi pi-arrow-up',
      command: () => {
        this.promover_nivel_academico_modal().open();
      },
    },
    {
      label: 'Exportar',
      icon: 'pi pi-download',
      command: () => {
        console.log('Esportar datos accion ejecutada');
      },
    },
  ];
  protected inprimir_menu: MenuItem[] = [
    {
      label: 'Listados',
      icon: 'pi pi-list',
      command: () => {
        this.loadings.imprimir = true;
        Promise.all(
          this.cantidad_de_estudiantes.secciones.map((seccion) => {
            return this.api.client.estudiantes.obtener_estudiantes.query({
              filtros: [
                {
                  campo: 'seccion',
                  condicion: StringCondicion.IGUAL,
                  valor: seccion.id,
                },
                {
                  campo: 'estado_academico',
                  condicion: NumberCondicion.IGUAL,
                  valor: ESTADO_ACADEMICO.ACTIVO,
                },
              ],
              paginacion: {
                page: 1,
                limit: 100,
              },
            });
          })
        ).then((seccion_de_estudiantes) => {
          seccion_de_estudiantes.forEach((estudiantes) => {
            const nivel_academico = estudiantes.data[0].nivel_academico;
            const seccion = estudiantes.data[0].seccion;
            const titulo = `Listado de Estudiantes de ${nivel_academico.nombre} seccion "${seccion?.seccion}"`;
            const filename = `listado_de_estudiantes_${seccion?.id}`;

            generar_listado_de_estudiantes(estudiantes.data, titulo, filename);
          });
        }).finally(() => {
          this.loadings.imprimir = false;
        });
      },
    },
  ];

  /* ............................... components ............................... */

  protected promover_nivel_academico_modal = viewChild.required(
    PromoverNivelAcademicoModalComponent
  );
  protected pensum_modal = viewChild.required(
    PensumModalComponent
  );

  /* .................................. data .................................. */
  protected cantidad_de_estudiantes: CantidadDeEstudiantesPorNivelAcademicoDTO =
    this.route.snapshot.data['cantidad_de_estudiantes'];
  protected pensum: PensumDTO = this.route.snapshot.data['pensum'];
  protected secciones_academicas = this.route.snapshot.data['secciones_academicas'] as Paginated<SeccionDTO>;
  protected get SECCIONES_ACADEMICAS_MAP() {
    return this.secciones_academicas.data.reduce((acc, seccion) => {
      acc[seccion.id] = seccion;
      return acc;
    }, {} as Record<string, SeccionDTO>);
  }
  /* ................................. metodos ................................ */

  obtener_color_seccion_class(seccion: string, contraste = false) {
    return obtener_color_seccion_class(seccion, contraste);
  }

  protected ColorSeccion = ColorSeccion;

  /* ................................. events ................................. */

  protected on_pensum_success(pensum: PensumDTO){


    this.toast.add({
      summary: 'Pensum actualizado con exito',
      severity: 'success',
    })
    
    this.pensum = pensum
  }

}
