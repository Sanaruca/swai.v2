import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmpleadoDTO, TIPO_DE_EMPLEADO } from '@swai/core';
import { CantidadDeEmpleadosDTO, Paginated } from '@swai/server';
import { InfoCardComponent } from '../../components';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InplaceModule } from 'primeng/inplace';
import { TablaDeEmpleadosComponent } from './components/tabla_de_empleados/tabla_de_empleados.component';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'aw-empleados.page',
  imports: [
    CommonModule,
    InfoCardComponent,
    TabsModule,
    TableModule,
    ButtonModule,
    RouterLink,
    InplaceModule,
    TablaDeEmpleadosComponent,
    FormsModule,
  ],
  templateUrl: './empleados.page.component.html',
  styleUrl: './empleados.page.component.css',
})
export class EmpleadosPageComponent {
  /* ................................ contantes ............................... */
  INSTITUTION_NAME = 'environment.INSTITUTION_NAME';

  /* ............................... injectables .............................. */
  private api = inject(ApiService);

  protected TIPO_DE_EMPLEADO = TIPO_DE_EMPLEADO;

  /* ............................... injectables .............................. */
  private route = inject(ActivatedRoute);

  /* .............................. data inicial .............................. */
  cantidad_de_empleados = this.route.snapshot.data[
    'cantidad_de_empleados'
  ] as CantidadDeEmpleadosDTO;
  empleados = this.route.snapshot.data['empleados'] as Paginated<EmpleadoDTO>;

  /* ................................. estado ................................. */
  current_tap = 0;

  /* ................................. metodos ................................ */

  protected switch_tap(tap: number) {
    if (tap === this.current_tap) return;
    this.current_tap = tap;
    if (tap === 0) {
      this.load_empleados();
      return;
    }
    this.load_empleados(tap);
  }

  private async load_empleados(tipo: TIPO_DE_EMPLEADO | 'all' = 'all') {
    if (tipo === 'all') {
      this.empleados =
        await this.api.client.empleados.obtener_empleados.query();
      return;
    }

    this.empleados = await this.api.client.empleados.obtener_empleados.query({
      por_tipo: tipo,
    });
  }
}
