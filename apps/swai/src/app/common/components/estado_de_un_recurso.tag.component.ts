import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ESTADO_DE_UN_RECURSO,
  ESTADOS_DE_UN_RECURSO,
  TIPOS_DE_ESPACIO_ACADEMICO,
} from '@swai/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'aw-tag-estado-de-un-recurso',
  imports: [CommonModule, TagModule],
  template: `
    <p-tag
      [styleClass]="
        className + ' min-w-max ' + (mostrar_nombre ? 'gap-1' : 'gap-0')
      "
      [value]="
        mostrar_nombre
          ? estado !== null
            ? ESTADOS_DE_UN_RECURSO[estado! - 1].nombre
            : 'Desconocido'
          : ''
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
export class EstadoDeUnRecursoTagComponent {
  ESTADOS_DE_UN_RECURSO = ESTADOS_DE_UN_RECURSO;
  TIPOS_DE_ESPACIOS_ACADEMICOS = TIPOS_DE_ESPACIO_ACADEMICO;
  @Input() estado?: ESTADO_DE_UN_RECURSO | null = null;
  @Input() mostrar_nombre = true;

  protected get className(): string {
    if (this.estado === null) return 'bg-gray-100 text-gray-500';

    return new Map([
      [ESTADO_DE_UN_RECURSO.NUEVO, 'bg-green-100 text-green-500'],
      [ESTADO_DE_UN_RECURSO.BUEN_ESTADO, 'bg-teal-100 text-teal-500'],
      [
        ESTADO_DE_UN_RECURSO.REPARACION_NECESARIA,
        'bg-yellow-100 text-yellow-600',
      ],
      [ESTADO_DE_UN_RECURSO.EN_MAL_ESTADO, 'bg-red-100 text-red-500'],
      [ESTADO_DE_UN_RECURSO.OBSOLETO, 'bg-gray-100 text-gray-500'],
    ]).get(this.estado!)!;
  }

  protected get icono(): string {
    if (this.estado === null) return 'pi pi-question';

    return new Map([
      [ESTADO_DE_UN_RECURSO.NUEVO, 'pi pi-check-circle'],
      [ESTADO_DE_UN_RECURSO.BUEN_ESTADO, 'pi pi-check-square'],
      [ESTADO_DE_UN_RECURSO.REPARACION_NECESARIA, 'pi pi-exclamation-triangle'],
      [ESTADO_DE_UN_RECURSO.EN_MAL_ESTADO, 'pi pi-times-circle'],
      [ESTADO_DE_UN_RECURSO.OBSOLETO, 'pi pi-caret-down'],
    ]).get(this.estado!)!;
  }
}
