import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { EstudianteDTO } from '@swai/core';
import { NombrePipe } from '../../../../../common/pipes/nombre.pipe';
import { ApiService } from '../../../../../services/api.service';

@Component({
  selector: 'aw-modal-eliminar-estudiante',
  imports: [CommonModule, DialogModule, ButtonModule, NombrePipe],
  templateUrl: './eliminar_estudiante.modal.component.html',
  styleUrl: './eliminar_estudiante.modal.component.css',
})
export class EliminarEstudianteModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() estudiante!: EstudianteDTO;

  @Output() success = new EventEmitter<void>();

  private api = inject(ApiService);

  protected loading = false;

  open() {
    this.visible = true;
    this.visibleChange.emit(true);
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  protected async eliminar() {
    this.loading = true;
    try {
      await this.api.client.estudiantes.eliminar_estudiante.mutate({
        cedula: this.estudiante.cedula,
      });
      this.close();
      this.success.emit();
    } finally {
      this.loading = false;
    }
  }
}
