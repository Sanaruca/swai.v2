import {
    Component,
    ElementRef,
    HostListener,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Avatar } from 'primeng/avatar';
import {
    TipoDeEmpleadoTagComponent,
    TipoDeEstudianteTagComponent,
} from '../../../../common/components';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { NombrePipe } from '../../../../common/pipes/nombre.pipe';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../services/auth.service';
import { UsuarioPayload } from '@swai/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router,
    RouterLink,
} from '@angular/router';
import { BusquedaRapidaDTO } from '@swai/server';
import { debounceTime } from 'rxjs';
import { ApiService } from '../../../../services/api.service';
import { OverlayModule } from 'primeng/overlay';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'aw-navbar',
  imports: [
    CommonModule,
    TipoDeEmpleadoTagComponent,
    TipoDeEstudianteTagComponent,
    Avatar,
    InputIcon,
    IconField,
    InputText,
    NombrePipe,
    MenuModule,
    BreadcrumbModule,
    RouterLink,
    ReactiveFormsModule,
    OverlayModule,
    ProgressBarModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  /* ............................... injectables .............................. */
  protected auth = inject(AuthService);
  private location = inject(Location);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected api = inject(ApiService);

  /* ................................. estado ................................. */
  protected busqueda_rapida: BusquedaRapidaDTO | null = null;
  protected usuario!: UsuarioPayload;

  protected profile_menu: MenuItem[] = [
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      routerLink: '/admin/configuracion',
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => {
        this.auth.logout();
      },
    },
  ];

  protected puede_mostrar_busqueda_rapida = false;

  loadings = {
    navegacion: false,
    busqueda_rapida: false,
  };

  protected breadcrumb: {
    home: MenuItem;
    items: Array<MenuItem & { active: boolean }>;
  } = {
    items: [],
    home: {
      label: 'Admin',
      icon: 'pi pi-home',
      routerLink: '/admin',
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

  @ViewChild('searchInput') searchInput!: ElementRef;
  isSearchOpen = false;
  busqueda_rapida_form_control = new FormControl<string>('');

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    // Check for Command+K (Mac) or Ctrl+K (Windows/Linux)
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.focusSearch();
    }

    // Close search on escape
    if (event.key === 'Escape') {
      this.isSearchOpen = false;
      setTimeout(() => {
        this.searchInput.nativeElement.blur();
      }, 0);
    }
  }

  focusSearch(): void {
    this.isSearchOpen = true;
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);
  }

  onSearchFocus(): void {
    this.isSearchOpen = true;
  }

  onSearchBlur(): void {
    this.isSearchOpen = false;
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
    this.busqueda_rapida_form_control.valueChanges
      .pipe(debounceTime(600))
      .subscribe((busqueda) => {
        if (!busqueda) return;
        this.loadings.busqueda_rapida = true;
        this.api.client.institucion.obtener_busqueda_rapida
          .query({
            busqueda,
            paginacion: { limit: 3 },
          })
          .then(({ data: [res] }) => (this.busqueda_rapida = res))
          .finally(() => (this.loadings.busqueda_rapida = false));
      });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadings.navegacion = true; // Inicia la carga
        this.puede_mostrar_busqueda_rapida = false;
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this.loadings.navegacion = false; // Finaliza la carga
        }, 1_000);
      }

      if (event instanceof NavigationEnd) {
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
