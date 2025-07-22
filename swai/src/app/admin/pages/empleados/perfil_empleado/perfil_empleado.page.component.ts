import { Component, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilLayoutComponent } from '../../../../common/layouts/perfil/perfil.layout.component';
import {
    SeccionCampoValorComponent,
    CampoValorComponent,
} from '../../../../common/layouts/perfil/components';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    AdministrativoDTO,
    EmpleadoDTO,
    generar_constancia_de_prestacion_de_servicio,
    NIVEL_ACADEMICO_CARDINAL_MAP,
    ProfesorDTO,
    TIPO_DE_EMPLEADO,
} from '@swai/core';
import { TipoDeEmpleadoTagComponent } from '../../../../common/components';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { Tag } from 'primeng/tag';
import { EliminarEmpladoModalComponent } from '../components/eliminar_empleado/eliminar_emplado.modal.component';

@Component({
  selector: 'aw-perfil-empleado.page',
  imports: [
    CommonModule,
    SeccionCampoValorComponent,
    CampoValorComponent,
    PerfilLayoutComponent,
    TipoDeEmpleadoTagComponent,
    MenuModule,
    ButtonModule,
    RouterLink,
    Tag,
    EliminarEmpladoModalComponent,
  ],
  templateUrl: './perfil_empleado.page.component.html',
  styleUrl: './perfil_empleado.page.component.css',
})
export class PerfilEmpleadoPageComponent implements OnInit {
  /* ............................... injectables .............................. */
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  /* ............................... constantes ............................... */
  protected TIPO_DE_EMPLEADO = TIPO_DE_EMPLEADO;
  protected NIVEL_ACADEMICO_CARDINAL_MAP = NIVEL_ACADEMICO_CARDINAL_MAP;

  /* ............................... components ............................... */

  protected eliminar_empleado_modal = viewChild.required(
    EliminarEmpladoModalComponent
  );

  /* .............................. data inicial .............................. */
  protected empleado = this.route.snapshot.data['empleado'] as
    | EmpleadoDTO
    | AdministrativoDTO
    | ProfesorDTO;

  protected imprimir_menu: MenuItem[] = [
    {
      label: 'Información',
      icon: 'pi pi-info-circle',
      command: () => {
        console.log('Imprimir Información');
      },
    },
    {
      label: 'Constancia de prestacion de servicio',
      icon: 'pi pi-align-left',
      command: () => {
        generar_constancia_de_prestacion_de_servicio(this.empleado);
      },
    },
  ];

  acctions_menu: MenuItem[] = [
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      command: () => {
        this.eliminar_empleado_modal().open();
      },
    },
  ];

  /* .............................. ciclo de vida ............................. */

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.empleado = data['empleado'];
    });
  }

  /* .................................. utils ................................. */
  protected $docente(empleado: EmpleadoDTO): ProfesorDTO {
    return empleado as ProfesorDTO;
  }

  protected $administrativo(empleado: EmpleadoDTO): AdministrativoDTO {
    return empleado as AdministrativoDTO;
  }

  /* ................................. events ................................. */

  on_empleado_eliminado() {
    this.router.navigate(['/admin/empleados']);
  }
}
