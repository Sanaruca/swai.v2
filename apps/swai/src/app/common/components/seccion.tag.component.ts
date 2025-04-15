import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorSeccion, ESTADOS_ACADEMICOS, SeccionColor } from '@swai/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'aw-tag-seccion',
  imports: [CommonModule, TagModule],
  template: `
    <p-tag
      [styleClass]="className"
      [value]="
        (solo_mostrar_letra ? '' : 'Seccion ') +
        (seccion?.toUpperCase() ?? 'No asignada')
      "
      [rounded]="true"
    >
      <div class="flex gap-1">
        <i [class]="seccion ? 'pi pi-hashtag' : 'pi pi-exclamation-circle'"></i>
      </div>
    </p-tag>
  `,
  styles: ``,
})
export class SeccionTagComponent {
  ESTADOS_ACADEMICOS = ESTADOS_ACADEMICOS;
  @Input() seccion: string | null = null;
  @Input() solo_mostrar_letra: boolean = false;

  protected get className(): string {
    if (!this.seccion) return 'bg-gray-100 text-gray-500 min-w-max';

    const color_seccion = ColorSeccion.getColor(this.seccion);

    const bg_color = new Map<SeccionColor, string>([
      [SeccionColor.BLUE, 'bg-blue-500'],
      [SeccionColor.CYAN, 'bg-cyan-500'],
      [SeccionColor.PINK, 'bg-pink-500'],
      [SeccionColor.INDIGO, 'bg-indigo-500'],
      [SeccionColor.YELLOW, 'bg-yellow-500'],
      [SeccionColor.GREEN, 'bg-green-500'],
    ]);

    return `${bg_color.get(color_seccion)} text-white min-w-max`;
  }
}
