import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'aw-fast-link',
  imports: [CommonModule, RouterLink],
  templateUrl: './fast_link.component.html',
  styleUrl: './fast_link.component.scss',
})
export class FastLinkComponent {
  @Input() routerLink?: string | any[];
  @Input() href: string = '#';
  @Input() target: string = '';
  @Input() title: string = 'Title';
  @Input() subtitle: string = 'Subtitle';

  @Input() icon: string = '';
  @Input() iconContentClassName: string = '';

  @ContentChild('icon', { static: true }) iconTemplate!: TemplateRef<any>; // Busca el ng-template con #valor
}
