import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilLayoutComponent } from '../../../../common/layouts/perfil/perfil.layout.component';
import {
  SeccionCampoValorComponent,
  CampoValorComponent,
} from '../../../../common/layouts/perfil/components';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  ],
  templateUrl: './perfil_empleado.page.component.html',
  styleUrl: './perfil_empleado.page.component.sass',
})
export class PerfilEmpleadoPageComponent implements OnInit {
  /* ............................... injectables .............................. */
  private route = inject(ActivatedRoute);

  /* ............................... constantes ............................... */
  protected TIPO_DE_EMPLEADO = TIPO_DE_EMPLEADO;
  protected NIVEL_ACADEMICO_CARDINAL_MAP = NIVEL_ACADEMICO_CARDINAL_MAP;

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
}
