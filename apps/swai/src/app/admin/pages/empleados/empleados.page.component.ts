import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmpleadoDTO, TIPO_DE_EMPLEADO } from '@swai/core';
import { CantidadDeEmpleadosDTO, Paginated } from '@swai/server';
import { InfoCardComponent } from '../../components';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import {
  IllustrationComponent,
  TipoDeEmpleadoTagComponent,
} from '../../../common/components';
import { ButtonModule } from 'primeng/button';
import { InplaceModule } from 'primeng/inplace';
import { TablaDeEmpleadosComponent } from './components/tabla_de_empleados/tabla_de_empleados.component';

@Component({
  selector: 'aw-empleados.page',
  imports: [
    CommonModule,
    InfoCardComponent,
    TabsModule,
    TableModule,
    IllustrationComponent,
    ButtonModule,
    RouterLink,
    TipoDeEmpleadoTagComponent,
    InplaceModule,
    TablaDeEmpleadosComponent,
  ],
  templateUrl: './empleados.page.component.html',
  styleUrl: './empleados.page.component.scss',
})
export class EmpleadosPageComponent  {

  
  protected TIPO_DE_EMPLEADO = TIPO_DE_EMPLEADO;
  
  
  /* ............................... injectables .............................. */
  private route = inject(ActivatedRoute);
  
  /* .............................. data inicial .............................. */
  cantidad_de_empleados = this.route.snapshot.data[
    'cantidad_de_empleados'
  ] as CantidadDeEmpleadosDTO;
  empleados = this.route.snapshot.data['empleados'] as Paginated<EmpleadoDTO>;
  
  /* ................................. estado ................................. */
  protected current_tap = 0
  
  /* .............................. ciclo de vida ............................. */
  
  /* ................................. metodos ................................ */
  protected load_empleados(){
  }

}
