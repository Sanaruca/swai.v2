import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'aw-fast-link',
  imports: [CommonModule, RouterLink],
  templateUrl: './fast_link.component.html',
  styleUrl: './fast_link.component.css',
})
export class FastLinkComponent {
  @Input() routerLink?: string | any[];
  @Input() href = '#';
  @Input() target = '';
  @Input() title = 'Title';
  @Input() subtitle = 'Subtitle';

  @Input() icon = '';
  @Input() iconContentClassName = '';

  @ContentChild('icon', { static: true }) iconTemplate!: TemplateRef<any>; // Busca el ng-template con #valor
}
