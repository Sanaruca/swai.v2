import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AreaDeFromacion,
  NIVEL_ACADEMICO_CARDINAL_MAP,
  NivelAcademico as CoreNivelAcademico,
  Seccion,
  get_next_section_value,
} from '@swai/core';
import { InfoCardComponent } from '../../../../components';
import { obtener_color_seccion_class } from '../../utils';
import { Tag } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { ApiService } from '../../../../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


interface NivelAcademicoConPensumDTO extends CoreNivelAcademico {
  pensum: Array<AreaDeFromacion & { horas: number }>;
}

export interface NivelAcademico extends NivelAcademicoConPensumDTO {
  secciones: Array<
    Seccion & {
      cantidad_de_estudiantes: {
        activos: number;
        no_inscritos: number;
        retirados: number;
        total: number;
      };
    }
  >;

  cantidad_de_estudiantes: {
    activos: number;
    no_inscritos: number;
    retirados: number;
    total: number;
  };
}

@Component({
  selector: 'aw-editable-nivel-academico',
  imports: [
    CommonModule,
    InfoCardComponent,
    Tag,
    RouterLink,
    ButtonModule,
    Divider,
    TooltipModule,
    ConfirmPopupModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './editable_nivel_academico.component.html',
  styleUrl: './editable_nivel_academico.component.scss',
})
export class EditableNivelAcademicoComponent {
  /* ............................... injectables .............................. */

  private toast = inject(MessageService);
  private api = inject(ApiService);
  private confirmationService = inject(ConfirmationService);

  /* ................................. inputs ................................. */
  nivel_academico = input.required<NivelAcademico>();

  /* ................................. outputs ................................ */

  changes_success = output<void>()

  /* ................................ constants ............................... */
  protected NIVEL_ACADEMICO_CARDINAL_MAP = NIVEL_ACADEMICO_CARDINAL_MAP;

  /* .................................. state ................................. */
  protected editing = false;
  protected loading = false;

  protected secciones_adicionales: Array<NivelAcademico['secciones'][0]> = [];

  /* ................................. metodos ................................ */
  
  toggle_editing(event: Event) {

    if (this.editing && this.secciones_adicionales.length) {
      this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Seguro que desea descartar los cambios?',
            icon: 'pi pi-exclamation-triangle',
            key: 'toggle_editing',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Aceptar'
            },
            accept: () => {
              this.cancelar();
            },
        });
    } else {
      this.editing = !this.editing;
    }

  }

  protected add_seccion() {
    const secciones = this.all_secciones;

    const last_seccion = secciones[secciones.length - 1];

    const last_seccion_value = last_seccion?.seccion?.toUpperCase() || 'A';
    const next_seccion_value = get_next_section_value(last_seccion_value);

    this.secciones_adicionales = [
      ...this.secciones_adicionales,
      {
        id: `${this.nivel_academico().numero}${next_seccion_value}`,
        seccion: next_seccion_value,
        nivel_academico: this.nivel_academico().numero,
        profesor_guia: null,
        cantidad_de_estudiantes: {
          activos: 0,
          no_inscritos: 0,
          retirados: 0,
          total: 0,
        },
      },
    ];
  }

  eliminar_seccion(seccion: NivelAcademico['secciones'][0], event: Event) {

    const index = this.secciones_adicionales.findIndex((it) => it.id === seccion.id);
    if (index > -1) {
      this.secciones_adicionales.splice(index, 1);
      return;
    }

    this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `¿Seguro que desea eliminar la sección académica "${seccion.id}"?`,
            header: 'Eliminar sección académica',
            icon: 'pi pi-info-circle',
            key: 'confirm_delete',
            rejectLabel: 'Cancelar',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Eliminar',
                severity: 'danger',
            },

            accept: () => {

              this.loading = true
              this.api.client.secciones_academicas.eliminar_seccion_academica.mutate(seccion.id).then(() => {
                this.toast.add({ severity: 'success', summary: 'Seccion Eliminada', detail: 'Seccion acacemica ha sido eliminada' });
              })
              .finally(() => this.loading = false)


            },
        });


  }

  cancelar(){
    this.secciones_adicionales = []
    this.editing = false
  }

  protected aplicar_cambios() {
    this.loading = true;

    Promise.all(
      this.secciones_adicionales.map((seccion) =>
        this.api.client.niveles_academicos.añadir_seccion_academica.mutate({
          nivel_academico: this.nivel_academico().numero,
          seccion: seccion.seccion,
        })
      )
    )
      .then(() => {
        this.toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Secciones añadidas',
        });
        this.changes_success.emit();
      })
      .catch((error: Error) =>
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        })
      )
      .finally(() => (this.loading = false));
  }

  /* ................................. helpers ................................ */

  protected obtener_color_seccion_class(seccion: string, contraste = false) {
    return obtener_color_seccion_class(seccion, contraste);
  }

  protected get all_secciones() {
    return [...this.nivel_academico().secciones, ...this.secciones_adicionales];
  }
}
