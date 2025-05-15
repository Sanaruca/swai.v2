import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CantidadDeEstudiantesPorNivelAcademicoDTO } from '@swai/server';
import { InfoCardComponent } from '../../../../admin/components';
import { EstudianteDTO, NIVEL_ACADEMICO_CARDINAL_MAP, NumberCondicion, PensumDTO } from '@swai/core';
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
    TablaDeEstudiantesComponent
  ],
  templateUrl: './nivel_academico.page.component.html',
  styleUrl: './nivel_academico.page.component.scss',
})
export class NivelAcademicoPageComponent {

  private route = inject(ActivatedRoute);

  NIVEL_ACADEMICO = +this.route.snapshot.paramMap.get('nivel_academico')!

  protected NumberCondicion = NumberCondicion
  protected NIVEL_ACADEMICO_CARDINAL_MAP = NIVEL_ACADEMICO_CARDINAL_MAP

  protected cantidad_de_estudiantes: CantidadDeEstudiantesPorNivelAcademicoDTO =
    this.route.snapshot.data['cantidad_de_estudiantes'];
  protected pensum: PensumDTO = this.route.snapshot.data['pensum'];
  protected estudiantes: Paginated<EstudianteDTO> =
    this.route.snapshot.data['estudiantes'];
 
  obtener_color_seccion_class(seccion: string, contraste = false) {
    return obtener_color_seccion_class(seccion, contraste);
  }

  }
