import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilLayoutComponent } from '../../../../common/layouts/perfil/perfil.layout.component';
import { SeccionCampoValorComponent, CampoValorComponent } from '../../../../common/layouts/perfil/components';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdministrativoDTO, EmpleadoDTO, generar_constancia_de_prestacion_de_servicio, ProfesorDTO, TIPO_DE_EMPLEADO } from '@swai/core';
import { TipoDeEmpleadoTagComponent } from '../../../../common/components';
import { Tag } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'aw-perfil-empleado.page',
  imports: [CommonModule, SeccionCampoValorComponent, CampoValorComponent, PerfilLayoutComponent, TipoDeEmpleadoTagComponent, Tag, MenuModule, ButtonModule, RouterLink],
  templateUrl: './perfil_empleado.page.component.html',
  styleUrl: './perfil_empleado.page.component.sass',
})
export class PerfilEmpleadoPageComponent {

  /* ............................... injectables .............................. */
  private route = inject(ActivatedRoute);

  /* ............................... constantes ............................... */
  protected TIPO_DE_EMPLEADO = TIPO_DE_EMPLEADO;

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
        }
      },
      {
        label: 'Constancia de prestacion de servicio',
        icon: 'pi pi-align-left',
        command: () =>{
          generar_constancia_de_prestacion_de_servicio(this.empleado)
        },
      }
    ]

}
