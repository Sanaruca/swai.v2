import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'aw-modal-eliminar-espacio-acaedemico',
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './eliminar_espacio_acaedemico.modal.component.html',
  styleUrl: './eliminar_espacio_acaedemico.modal.component.scss',
})
export class EliminarEspacioAcaedemicoModalComponent {
  @Input() spaceName: string = 'Espacio Académico';
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();

  onHide(): void {
    this.visibleChange.emit(false);
  }

  onConfirm(): void {
    this.confirm.emit();
    this.visibleChange.emit(false);
  }
}
