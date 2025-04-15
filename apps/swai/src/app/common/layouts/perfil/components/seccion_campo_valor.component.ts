import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'aw-seccion-campo-valor',
  imports: [CommonModule],
  template: `
    <h5>{{ titulo }}</h5>
    <section class="flex flex-wrap gap-10 gap-y-5 mt-4">
      <ng-content select="aw-campo-valor" class="gap-y-5" />
    </section>
  `,
  styles: `
  :host{
    @apply block;
  }    
  `,
  host: { class: 'layout_card' },
})
export class SeccionCampoValorComponent {
  @Input() titulo = 'Sin titulo';
}
