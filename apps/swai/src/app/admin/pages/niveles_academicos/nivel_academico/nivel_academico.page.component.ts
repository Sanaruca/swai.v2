import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CantidadDeEstudiantesPorNivelAcademicoDTO } from '@swai/server';
import { InfoCardComponent } from '../../../../admin/components';
import {
  ESTADO_ACADEMICO,
  EstudianteDTO,
  generar_listado_de_estudiantes,
  NIVEL_ACADEMICO_CARDINAL_MAP,
  NumberCondicion,
  PensumDTO,
  StringCondicion,
} from '@swai/core';
import { TableModule } from 'primeng/table';
import { Paginated } from '@swai/server';
import { MomentModule } from 'ngx-moment';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { TablaDeEstudiantesComponent } from '../../estudiantes/components/tabla_de_estudiantes/tabla_de_estudiantes.component';
import { obtener_color_seccion_class } from '../utils/info_card_seccion_color.util';
import { MenuItem } from 'primeng/api';
import { ApiService } from '../../../../services/api.service';

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
  ],
  templateUrl: './nivel_academico.page.component.html',
  styleUrl: './nivel_academico.page.component.scss',
})
export class NivelAcademicoPageComponent {
  /* ............................... injectables .............................. */
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  /* ................................ constants ............................... */

  NIVEL_ACADEMICO = +this.route.snapshot.paramMap.get('nivel_academico')!;
  protected NIVEL_ACADEMICO_CARDINAL_MAP = NIVEL_ACADEMICO_CARDINAL_MAP;
  protected NumberCondicion = NumberCondicion;
  protected acciones_menu: MenuItem[] = [
    {
      label: 'Promover',
      icon: 'pi pi-arrow-up',
      command: () => {
        console.log('Promover accion ejecutada');
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
        });
      },
    },
  ];

  /* .................................. data .................................. */
  protected cantidad_de_estudiantes: CantidadDeEstudiantesPorNivelAcademicoDTO =
    this.route.snapshot.data['cantidad_de_estudiantes'];
  protected pensum: PensumDTO = this.route.snapshot.data['pensum'];
  protected estudiantes: Paginated<EstudianteDTO> =
    this.route.snapshot.data['estudiantes'];

  /* ................................. metodos ................................ */

  obtener_color_seccion_class(seccion: string, contraste = false) {
    return obtener_color_seccion_class(seccion, contraste);
  }
}
