import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilLayoutComponent } from '../../../../common/layouts/perfil/perfil.layout.component';
import {
  CampoValorComponent,
  SeccionCampoValorComponent,
} from '../../../../common/layouts/perfil/components';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstudianteDTO, generar_constancia_de_estudios, NIVEL_ACADEMICO, TIPO_DE_ESTUDIANTE } from '@swai/core';
import {
  EstadoAcademicoTagComponent,
  TipoDeEstudianteTagComponent,
} from '../../../../common/components';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { FastLinkComponent } from '../../../components';
import { NombrePipe } from '../../../../common/pipes/nombre.pipe';
import { Avatar } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { EliminarEstudianteModalComponent } from "../components/eliminar_estudiante/eliminar_estudiante.modal.component";

@Component({
  selector: 'aw-perfil-estudiante',
  imports: [
    CommonModule,
    PerfilLayoutComponent,
    SeccionCampoValorComponent,
    CampoValorComponent,
    EstadoAcademicoTagComponent,
    Tag,
    TipoDeEstudianteTagComponent,
    RouterLink,
    ButtonModule,
    FastLinkComponent,
    NombrePipe,
    Avatar,
    MenuModule,
    EliminarEstudianteModalComponent
],
  templateUrl: './perfil_estudiante.page.component.html',
  styleUrl: './perfil_estudiante.page.component.scss',
})
export class PerfilEstudiantePageComponent implements OnInit {

  @ViewChild(EliminarEstudianteModalComponent) eliminar_estudiante_modal!: EliminarEstudianteModalComponent

  /* ............................... constantes ............................... */
  TIPO_DE_ESTUDIANTE = TIPO_DE_ESTUDIANTE;
  NIVEL_ACADEMICO = NIVEL_ACADEMICO;


  /* ............................... injectables .............................. */
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(MessageService);

  /* .............................. data inicial .............................. */

  protected estudiante: EstudianteDTO = this.route.snapshot.data['estudiante'];

  protected imprimir_menu: MenuItem[] = [
    {
      label: 'Información',
      icon: 'pi pi-info-circle',
      command: () => {
        console.log('Imprimir Información');
      }
    },
    {
      label: 'Carnet',
      icon: 'pi pi-id-card',
      command: () => {
        console.log('Imprimir Carnet');
      }
    },
    {
      label: 'Constancia de Estudios',
      icon: 'pi pi-align-left',
      command: () => {
        generar_constancia_de_estudios(this.estudiante)
      }
    }
  ]

  protected adicional_menu: MenuItem[] = [
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      command: () => {
        this.eliminar_estudiante_modal.open()
      }
    },
  ]

  /* .............................. ciclo de vida ............................. */

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.estudiante = data['estudiante'];
    })
  }

  /* ................................. metodos ................................ */



  getNivelAcademicoIconClassName(nivel: number): string {
    return new Map<number, string>([
      [NIVEL_ACADEMICO.Primero, 'bg-blue-100 text-blue-600'],
      [NIVEL_ACADEMICO.Segundo, 'bg-teal-100 text-teal-600'],
      [NIVEL_ACADEMICO.Tercero, 'bg-cyan-100 text-cyan-600'],
      [NIVEL_ACADEMICO.Cuarto, 'bg-pink-100 text-pink-600'],
      [NIVEL_ACADEMICO.Quinto, 'bg-indigo-100 text-indigo-600'],
    ]).get(nivel)!;
  }

  protected on_eliminar_estudiante_success() {

    this.toast.add({
      summary: 'Estudiante eliminado con exito',
      severity: 'success',
    })

    this.router.navigate(['/admin/estudiantes'])
  }
}
