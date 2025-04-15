import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NIVEL_ACADEMICO, NIVELES_ACADEMICOS } from '@swai/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'aw-tag-nivel-academico',
  imports: [CommonModule, TagModule],
  template: `
    <p-tag
      [styleClass]="className"
      [value]="
        nivel
          ? mostrar_nombre
            ? NIVELES_ACADEMICOS[nivel - 1].nombre
            : nivel.toString()
          : 'No asignado'
      "
      [rounded]="true"
    >
      <div class="flex gap-1">
        <i class="pi pi-circle-fill text-sm"></i>
      </div>
    </p-tag>
  `,
  styles: ``,
})
export class NivelAcademicoTagComponent {
  NIVELES_ACADEMICOS = NIVELES_ACADEMICOS;
  @Input() nivel: number | null = null;
  @Input() mostrar_nombre: boolean = true;

  protected get className(): string {
    if (!this.nivel) return 'bg-gray-100 text-gray-500';

    const class_name = new Map<NIVEL_ACADEMICO, string>([
      [NIVEL_ACADEMICO.Primero, 'bg-blue-100 text-blue-500'],
      [NIVEL_ACADEMICO.Segundo, 'bg-teal-100 text-teal-500'],
      [NIVEL_ACADEMICO.Tercero, 'bg-cyan-100 text-cyan-500'],
      [NIVEL_ACADEMICO.Cuarto, 'bg-pink-100 text-pink-500'],
      [NIVEL_ACADEMICO.Quinto, 'bg-indigo-100 text-indigo-500'],
    ]);

    return `${class_name.get(this.nivel)} min-w-max`;
  }
}
