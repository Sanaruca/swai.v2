import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESTADO_ACADEMICO, ESTADOS_ACADEMICOS } from '@swai/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'aw-tag-estado-academico',
  imports: [CommonModule, TagModule],
  template: `
    <p-tag
      [styleClass]="className + ' min-w-max'"
      [value]="
        estado !== null ? ESTADOS_ACADEMICOS[estado! - 1].nombre : 'No asignado'
      "
      [rounded]="true"
    >
      <div class="flex gap-1">
        <i [class]="icono"></i>
      </div>
    </p-tag>
  `,
  styles: ``,
})
export class EstadoAcademicoTagComponent {
  ESTADOS_ACADEMICOS = ESTADOS_ACADEMICOS;
  @Input() estado?: ESTADO_ACADEMICO | null = null;

  protected get className(): string {
    if (this.estado === null) return 'bg-gray-100 text-gray-500';

    return new Map([
      [ESTADO_ACADEMICO.ACTIVO, 'bg-green-100 text-green-500'],
      [ESTADO_ACADEMICO.EGRESADO, 'bg-teal-100 text-teal-500'],
      [ESTADO_ACADEMICO.NO_INSCRITO, 'bg-yellow-100 text-yellow-600'],
      [ESTADO_ACADEMICO.RETIRADO, 'bg-slate-100 text-slate-500'],
    ]).get(this.estado!)!;
  }

  protected get icono(): string {
    if (this.estado === null) return 'pi pi-question';

    return new Map([
      [ESTADO_ACADEMICO.ACTIVO, 'pi pi-check-circle'],
      [ESTADO_ACADEMICO.EGRESADO, 'pi pi-heart-fill'],
      [ESTADO_ACADEMICO.NO_INSCRITO, 'pi pi-exclamation-circle'],
      [ESTADO_ACADEMICO.RETIRADO, 'pi pi-sign-out'],
    ]).get(this.estado!)!;
  }
}
