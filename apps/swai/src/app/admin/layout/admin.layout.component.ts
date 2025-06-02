import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuModule } from 'primeng/menu';
import { ReactiveFormsModule } from '@angular/forms';
// For dynamic progressbar demo
import { OverlayModule } from 'primeng/overlay';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'aw-admin.layout',
  imports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    BreadcrumbModule,
    RouterModule,
    ScrollPanelModule,
    ToastModule,
    ProgressBarModule,
    MenuModule,

    ReactiveFormsModule,
    RouterLink,

    OverlayModule,
    NavbarComponent,
  ],
  templateUrl: './admin.layout.component.html',
  styleUrl: './admin.layout.component.scss',
})
export class AdminLayoutComponent implements OnInit {
  /* ............................... injectables .............................. */
  private location = inject(Location);
  private router = inject(Router);

  /* ................................. estado ................................. */

  protected sidebar_open = false;
  protected current_url: string = this.location.path();

  /* .............................. ciclo de vida ............................. */
  ngOnInit() {
    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        this.current_url = event.urlAfterRedirects;
      }
    });
  }
}
