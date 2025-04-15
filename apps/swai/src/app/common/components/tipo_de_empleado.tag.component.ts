import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TIPO_DE_EMPLEADO, TIPOS_DE_EMPLEADO } from '@swai/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'aw-tag-tipo-de-empleado',
  imports: [CommonModule, TagModule],
  template: `
    <p-tag
      [styleClass]="className + ' | min-w-max'"
      [value]="
        tipo !== null ? TIPOS_DE_EMPLEADO[tipo! - 1].nombre : 'No asignado'
      "
      [rounded]="true"
    >
      <div class="flex">
        <i [class]="icono"></i>
      </div>
    </p-tag>
  `,
  styles: ``,
})
export class TipoDeEmpleadoTagComponent {
  TIPOS_DE_EMPLEADO = TIPOS_DE_EMPLEADO;
  @Input() tipo?: TIPO_DE_EMPLEADO | null = null;

  protected get className(): string {
    if (this.tipo === null) return 'bg-gray-100 text-gray-500';

    return new Map([
      [TIPO_DE_EMPLEADO.ADMINISTRATIVO, 'bg-pink-500 text-white'],
      [TIPO_DE_EMPLEADO.DOCENTE, 'bg-blue-500 text-white'],
      [TIPO_DE_EMPLEADO.OBRERO, 'bg-indigo-500 text-white'],
    ]).get(this.tipo!)!;
  }

  protected get icono(): string {
    if (this.tipo === null) return 'pi pi-question';

    return new Map([
      [TIPO_DE_EMPLEADO.ADMINISTRATIVO, 'pi pi-briefcase'],
      [TIPO_DE_EMPLEADO.DOCENTE, 'pi pi-book'],
      [TIPO_DE_EMPLEADO.OBRERO, 'pi pi-building'],
    ]).get(this.tipo!)!;
  }
}
