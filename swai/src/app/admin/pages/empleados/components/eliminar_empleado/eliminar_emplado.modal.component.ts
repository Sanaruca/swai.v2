import { Component, inject, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NombrePipe } from '../../../../../common/pipes/nombre.pipe';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { EmpleadoDTO } from '@swai/core';
import { ApiService } from '../../../../../services/api.service';

@Component({
  selector: 'aw-modal-eliminar-emplado',
  imports: [CommonModule, DialogModule, ButtonModule, NombrePipe],
  templateUrl: './eliminar_emplado.modal.component.html',
  styleUrl: './eliminar_emplado.modal.component.css',
})
export class EliminarEmpladoModalComponent {
  /* ............................... injectables .............................. */

  private api = inject(ApiService);

  /* ................................. inputs ................................. */

  @Input() empleado!: EmpleadoDTO;

  /* ................................. outputs ................................ */

  protected success = output<void>();

  /* .................................. state ................................. */

  protected loading = false;
  protected visible = false;

  /* ................................. metodos ................................ */

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

  protected async eliminar() {
    this.loading = true;

    try {
      await this.api.client.empleados.eliminar_empleado.mutate(
        this.empleado.cedula
      );

      this.success.emit();
    } finally {
      this.loading = false;
    }
  }
}
