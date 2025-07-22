import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { EmpleadoDTO } from '@swai/core';
import { Paginated } from '@swai/server';
import { NombrePipe } from '../../../../../common/pipes/nombre.pipe';
import {
    IllustrationComponent,
    TipoDeEmpleadoTagComponent,
} from '../../../../../common/components';
import { Inplace } from 'primeng/inplace';
import { Button } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'aw-tabla-de-empleados',
  imports: [
    CommonModule,
    TableModule,
    NombrePipe,
    TipoDeEmpleadoTagComponent,
    Inplace,
    Button,
    IllustrationComponent,
    Avatar,
    RouterLink,
    TooltipModule,
  ],
  templateUrl: './tabla_de_empleados.component.html',
  styleUrl: './tabla_de_empleados.component.css',
})
export class TablaDeEmpleadosComponent {
  @Input() empleados!: Paginated<EmpleadoDTO>;
  @Input() tipo: 'default' | 'administrativo' | 'docente' | 'obrero' =
    'default';
  @Input() loading = false;

  /* ............................... injectables .............................. */

  private router = inject(Router);

  /* ................................. metodos ................................ */

  protected async navigateOnDoubleClick(comands: any[]) {
    await this.router.navigate(comands);
  }
}
