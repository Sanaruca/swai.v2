import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SEXO } from '@swai/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'aw-tag-sexo',
  imports: [CommonModule, TagModule],
  template: `
    <p-tag [styleClass]="className" [value]="value" [rounded]="true">
      <div class="flex gap-1">
        <i [class]="icon"></i>
      </div>
    </p-tag>
  `,
  styles: ``,
})
export class SexoTagComponent {
  SEXO = SEXO;
  @Input() sexo!: SEXO;

  protected get value(): string {
    const icon_map = new Map<SEXO, string>([
      [SEXO.MASCULINO, 'Masculino'],
      [SEXO.FEMENINO, 'Femenino'],
    ]);

    return icon_map.get(this.sexo)!;
  }

  protected get icon(): string {
    const icon_map = new Map<SEXO, string>([
      [SEXO.MASCULINO, 'pi pi-mars'],
      [SEXO.FEMENINO, 'pi pi-venus'],
    ]);

    return icon_map.get(this.sexo)!;
  }

  protected get className(): string {
    const class_map = new Map<SEXO, string>([
      [SEXO.MASCULINO, 'bg-blue-100 text-blue-500'],
      [SEXO.FEMENINO, 'bg-pink-100 text-pink-500'],
    ]);

    return class_map.get(this.sexo)!;
  }
}
