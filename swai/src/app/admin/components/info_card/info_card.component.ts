import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'aw-info-card',
  imports: [CommonModule, RouterLink, SkeletonModule],
  templateUrl: './info_card.component.html',
  styleUrls: ['./info_card.component.css'],
})
export class InfoCardComponent {
  @Input() className = ''; // Clases adicionales proporcionadas por el usuario
  @Input() iconContentClassName = '';
  @Input() icon = '';
  @Input() label = 'No label';
  @Input() value: any = 'No value';
  @Input() variant: 'default' | 'vertical' = 'default';
  @Input() link: RouterLink['routerLink'];
  @Input() loading = false;

  // HostBinding para combinar las clases base con las clases dinámicas
  get hostClasses() {
    const variant = this.variant === 'vertical' ? 'grid' : 'flex gap-1';

    const baseClasses = 'bg-surface-100 dark:bg-surface-800'; // Clases base

    if (this.className.trim()) {
      return `${this.className.trim()} | min-w-max | ${variant}`; // Concatenar clases base con las dinámicas
    }

    return `${baseClasses} | min-w-max | ${variant}`;
  }
}
