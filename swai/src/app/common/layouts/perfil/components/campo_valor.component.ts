import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'aw-campo-valor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="font-semibold">{{ campo }}</p>
    <ng-container *ngIf="valorTemplate; else defaultValor">
      <ng-container
        *ngTemplateOutlet="valorTemplate; context: { $implicit: valor }"
      ></ng-container>
    </ng-container>
    <ng-template #defaultValor>
      <p>{{ valor }}</p>
    </ng-template>
  `,
  styles: [
    `
      :host {
        @apply inline-block;
      }
    `,
  ],
})
export class CampoValorComponent {
  @Input() campo!: string;
  @Input() valor!: any;

  @ContentChild('valor', { static: true }) valorTemplate!: TemplateRef<any>; // Busca el ng-template con #valor
}
