import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TIPO_DE_ESTUDIANTE, TIPOS_DE_ESTUDIANTE } from '@swai/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'aw-tag-tipo-de-estudiante',
  imports: [CommonModule, TagModule],
  template: `
    <p-tag
      [styleClass]="className"
      [value]="
        tipo !== null ? TIPOS_DE_ESTUDIANTE[tipo! - 1].nombre : 'No asignado'
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
export class TipoDeEstudianteTagComponent {
  TIPOS_DE_ESTUDIANTE = TIPOS_DE_ESTUDIANTE;
  @Input() tipo?: TIPO_DE_ESTUDIANTE | null = null;

  protected get className(): string {
    if (this.tipo === null) return 'bg-gray-100 text-gray-500';

    return new Map([
      [TIPO_DE_ESTUDIANTE.REGULAR, 'bg-sky-500 text-white'],
      [TIPO_DE_ESTUDIANTE.REPITIENTE, 'bg-slate-100 text-slate-500'],
      [TIPO_DE_ESTUDIANTE.EGRESADO, 'bg-indigo-500 text-white'],
    ]).get(this.tipo!)!;
  }

  protected get icono(): string {
    if (this.tipo === null) return 'pi pi-question';

    return new Map([
      [TIPO_DE_ESTUDIANTE.REGULAR, 'pi pi-spinner'],
      [TIPO_DE_ESTUDIANTE.REPITIENTE, 'pi pi-replay'],
      [TIPO_DE_ESTUDIANTE.EGRESADO, 'pi pi-heart-fill'],
    ]).get(this.tipo!)!;
  }
}
