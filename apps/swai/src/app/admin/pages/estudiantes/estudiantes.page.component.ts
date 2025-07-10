import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FastLinkComponent, InfoCardComponent } from '../../components';
import { CantidadDeEstudiantesDTO, Paginated } from '@swai/server';
import { EstudianteDTO } from '@swai/core';
import { ApiService } from '../../../services/api.service';
import { MomentModule } from 'ngx-moment';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { GenerarListadosModalComponent } from './components/generar_listados/generar_listados.modal.component';
import { TablaDeEstudiantesComponent } from './components/tabla_de_estudiantes/tabla_de_estudiantes.component';

@Component({
  selector: 'aw-estudiantes.page',
  imports: [
    CommonModule,
    ButtonModule,
    RouterLink,
    InfoCardComponent,
    FastLinkComponent,
    MomentModule,
    MenuModule,
    TooltipModule,
    GenerarListadosModalComponent,
    TablaDeEstudiantesComponent
  ],
  templateUrl: './estudiantes.page.component.html',
  styleUrl: './estudiantes.page.component.scss',
})
export class EstudiantesPageComponent  {
  /* ............................... injectables .............................. */
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /* ................................ contantes ............................... */
  protected INSTITUTION_NAME = 'environment.INSTITUTION_NAME';

  
  /* ............................... components ............................... */
  protected generar_listados_modal = viewChild.required(
    GenerarListadosModalComponent
  )

  /* .................................. state ................................. */

  protected imprimir_menu: MenuItem[] = [
    {
      label: 'Listados',
      icon: 'pi pi-copy',
      command: () => {
        this.generar_listados_modal().show();
      }
    },
  ];


  /* .................................. data .................................. */
  cantidad_de_estudiantes = this.route.snapshot.data[
    'cantidad_de_estudiantes'
  ] as CantidadDeEstudiantesDTO;
  estudiantes = this.route.snapshot.data[
    'estudiantes'
  ] as Paginated<EstudianteDTO>;


}
