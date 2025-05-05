import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { MenuItem } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { AuthService } from '../../services/auth.service';
import { UsuarioPayload } from '@swai/core';
import { Avatar } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
// For dynamic progressbar demo

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
    Avatar,
    MenuModule,
    InputIcon,
    IconField,
    InputText,
    FormsModule
  ],
  templateUrl: './admin.layout.component.html',
  styleUrl: './admin.layout.component.scss',
})
export class AdminLayoutComponent implements OnInit {
  /* ............................... injectables .............................. */

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  protected auth = inject(AuthService);

  /* ................................. estado ................................. */

  protected usuario!: UsuarioPayload;

  protected profile_menu: MenuItem[] = [
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => {
        this.auth.logout();
      },
    },
  ];

  loading = false;

  protected current_url: string = this.location.path();

  protected breadcrumb: {
    home: MenuItem;
    items: Array<MenuItem & { active: boolean }>;
  } = {
    items: [],
    home: {
      label: 'Admin',
      icon: 'pi pi-home',
      routerLink: '/',
    },
  };

  get breadcrumb_items(): MenuItem[] {
    const copy = JSON.parse(JSON.stringify(this.breadcrumb.items)) as Array<
      MenuItem & { active: boolean }
    >;
    const last_index = copy.length - 1;
    const last = copy.at(last_index);
    if (last) last.active = true;
    return [this.breadcrumb.home, ...copy.slice(0, last_index), last] as any;
  }

  @ViewChild('main') main!: ElementRef;

  @ViewChild("searchInput") searchInput!: ElementRef
  isSearchOpen = false
  searchText = ""

  @HostListener("window:keydown", ["$event"])
  handleKeyDown(event: KeyboardEvent): void {
    // Check for Command+K (Mac) or Ctrl+K (Windows/Linux)
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault()
      this.focusSearch()
    }

    // Close search on escape
    if (event.key === "Escape") {
      this.isSearchOpen = false
      setTimeout(() => {
        this.searchInput.nativeElement.blur()
      }, 0)
    }
  }

  focusSearch(): void {
    this.isSearchOpen = true
    setTimeout(() => {
      this.searchInput.nativeElement.focus()
    }, 0)
  }

  onSearchFocus(): void {
    this.isSearchOpen = true
  }

  onSearchBlur(): void {
    this.isSearchOpen = false
  }



  /* .............................. ciclo de vida ............................. */
  constructor() {
    this.auth.usuario.subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true; // Inicia la carga
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this.loading = false; // Finaliza la carga
        }, 1_000);
      }

      if (event instanceof NavigationEnd) {
        this.current_url = event.urlAfterRedirects;
        if (this.main) {
          this.main.nativeElement.scrollTo({
            top: 0,
            behavior: 'smooth',
          }); // Desplazar al inicio
        }
      }
    });

    this.updateBreadcrumb();
    this.router.events.subscribe(() => {
      this.updateBreadcrumb();
    });
  }

  updateBreadcrumb() {
    const currentRoute: ActivatedRouteSnapshot = this.route.snapshot;
    this.breadcrumb.items = this.getBreadcrumbMenuItemsFromRoute(
      currentRoute
    ) as any;
  }

  private getBreadcrumbMenuItemsFromRoute(
    route: ActivatedRouteSnapshot
  ): MenuItem[] {
    const menuItems: MenuItem[] = [];
    let currentRoute: ActivatedRouteSnapshot | null = route;

    while (currentRoute) {
      if (
        currentRoute.url.toString() &&
        currentRoute.data &&
        currentRoute.data['breadcrumb']
      ) {
        menuItems.push(currentRoute.data['breadcrumb']);
      }
      currentRoute = currentRoute.firstChild;
    }

    return menuItems;
  }
}
