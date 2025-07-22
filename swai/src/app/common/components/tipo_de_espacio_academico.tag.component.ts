import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TIPO_DE_ESPACIO_ACADEMICO,
  TIPOS_DE_ESPACIO_ACADEMICO,
} from '@swai/core';
import { TagModule } from 'primeng/tag';
import { tipo_de_espacio_academico_primeicon_map } from '../utils';

@Component({
  selector: 'aw-tag-tipo-de-espacio-academico',
  imports: [CommonModule, TagModule],
  template: `
    <p-tag
      [styleClass]="className + ' min-w-max'"
      [value]="
        tipo !== null
          ? TIPOS_DE_ESPACIOS_ACADEMICOS[tipo! - 1].nombre
          : 'Desconocido'
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
export class TipoDeEspacioAcademicoTagComponent {
  TIPOS_DE_ESPACIOS_ACADEMICOS = TIPOS_DE_ESPACIO_ACADEMICO;
  @Input() tipo?: TIPO_DE_ESPACIO_ACADEMICO | null = null;

  protected get className(): string {
    if (this.tipo === null) return 'bg-gray-100 text-gray-500';

    return (
      new Map([
        [TIPO_DE_ESPACIO_ACADEMICO.AIRE_LIBRE, 'bg-green-500'],
        [TIPO_DE_ESPACIO_ACADEMICO.AUDITORIO, 'bg-indigo-500'],
        [TIPO_DE_ESPACIO_ACADEMICO.BIBLIOTECA, 'bg-pink-500'],
        [TIPO_DE_ESPACIO_ACADEMICO.LABORATORIO, 'bg-cyan-500'],
        [TIPO_DE_ESPACIO_ACADEMICO.SALON_DE_CLASES, 'bg-blue-500'],
      ]).get(this.tipo!)! + ' text-white'
    );
  }

  protected get icono(): string {
    if (this.tipo === null) return 'pi pi-question';

    return tipo_de_espacio_academico_primeicon_map[
      this.tipo as TIPO_DE_ESPACIO_ACADEMICO
    ];
  }
}
