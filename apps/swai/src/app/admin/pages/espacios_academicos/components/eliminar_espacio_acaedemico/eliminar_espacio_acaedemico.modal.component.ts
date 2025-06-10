import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { EspacioAcademico } from '@swai/core';
import { ApiService } from '../../../../../services/api.service';

@Component({
  selector: 'aw-modal-eliminar-espacio-acaedemico',
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './eliminar_espacio_acaedemico.modal.component.html',
  styleUrl: './eliminar_espacio_acaedemico.modal.component.scss',
})
export class EliminarEspacioAcaedemicoModalComponent {
  /* ............................... injectables .............................. */

  private api = inject(ApiService);

  protected espacio_academico: Omit<EspacioAcademico, 'metadata'> | null = null;
  protected visible = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() protected confirm = new EventEmitter<void>();
  @Output() protected succes = new EventEmitter<void>();

  onHide(): void {
    this.visibleChange.emit(false);
  }

  onConfirm(): void {
    this.confirm.emit();
    this.visibleChange.emit(false);
    this.eliminar();
  }

  private show(): void {
    this.visible = true;
    this.visibleChange.emit(true);
  }

  private hide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  open(espacio_academico: Omit<EspacioAcademico, 'metadata'>) {
    this.espacio_academico = espacio_academico;
    this.show();
  }

  cancel() {
    this.hide();
  }

  protected eliminar() {
    if(!this.espacio_academico) return;

    this.api.client.espacios_academicos.eliminar_espacio_academico.mutate(
      this.espacio_academico.id
    ).then(() => {
      this.succes.emit();
      this.hide();
    });
  }
}
