import {
  Component,
  inject,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FastLinkComponent, InfoCardComponent } from '../../components';
import { CantidadDeEstudiantesDTO, Paginated } from '@swai/server';
import { EstudianteDTO, SEXOS } from '@swai/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { obtener_color_seccion_class } from '../niveles_academicos/utils';
import { ApiService } from '../../../services/api.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Avatar } from 'primeng/avatar';
import {
  EstadoAcademicoTagComponent,
  IllustrationComponent,
  NivelAcademicoTagComponent,
  SeccionTagComponent,
  SexoTagComponent,
} from '../../../common/components';
import { MomentModule } from 'ngx-moment';
import { Menu, MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from '../../../../environments/environment';
import { MenuItem } from 'primeng/api';
import { GenerarListadosModalComponent } from './components/generar_listados/generar_listados.modal.component';
import { ChipModule } from 'primeng/chip';
import { SelectModule } from 'primeng/select';

enum SelectableCondicion {
  IGUAL = 'IGUAL',
  DISTINTO = 'DISTINTO',
}

enum StringCondicion {
  IGUAL = 'IGUAL',
  DISTINTO = 'DISTINTO',
  CONTIENE = 'CONTIENE',
  MAYOR_QUE = 'MAYOR_QUE',
  MENOR_QUE = 'MENOR_QUE',
}



enum NumberCondicion {
  IGUAL = 'IGUAL',
  DISTINTO = 'DISTINTO',
  MAYOR_QUE = 'MAYOR_QUE',
  MENOR_QUE = 'MENOR_QUE',
}


enum BooleanCondicion {
  IGUAL = 'IGUAL',
  DISTINTO = 'DISTINTO',
}



enum DateCondicion {
  IGUAL = 'IGUAL',
  DISTINTA = 'DISTINTA',
  DESPUES_DE = 'DESPUES_DE',
  ANTES_DE = 'ANTES_DE',
}


type Condicion =
  | StringCondicion
  | NumberCondicion
  | BooleanCondicion
  | DateCondicion
  | SelectableCondicion;

  type Selectable<T = unknown> = Array<T>

enum TIPO_DE_CONDICION {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  SELECTABLE = 'selectable',
}
type TipoDeCampo<T = unknown> = string | number | boolean | Date | Selectable<T>;

interface Filtro<T extends TipoDeCampo = TipoDeCampo> {
  campo: string;
  condicion: T extends string
    ? StringCondicion
    : T extends number
    ? NumberCondicion
    : T extends boolean
    ? BooleanCondicion
    : T extends Date
    ? DateCondicion
    : T extends Date
    ? SelectableCondicion
    : Condicion;
  valor: T;
}

interface Wrapper<T> {
  name: string;
  value: T;
}

@Component({
  selector: 'aw-estudiantes.page',
  imports: [
    CommonModule,
    ButtonModule,
    RouterLink,
    InfoCardComponent,
    FastLinkComponent,
    TableModule,
    SkeletonModule,
    IconField,
    InputIcon,
    InputTextModule,
    ReactiveFormsModule,
    Avatar,
    SexoTagComponent,
    EstadoAcademicoTagComponent,
    SeccionTagComponent,
    MomentModule,
    MenuModule,
    IllustrationComponent,
    NivelAcademicoTagComponent,
    TooltipModule,
    GenerarListadosModalComponent,
    ChipModule,
    SelectModule,
  ],
  templateUrl: './estudiantes.page.component.html',
  styleUrl: './estudiantes.page.component.scss',
})
export class EstudiantesPageComponent implements OnInit {
  /* ................................ contantes ............................... */
  protected INSTITUTION_NAME = environment.INSTITUTION_NAME;

  protected CAMPOS = ['sexo'];

  protected TIPO_DE_CONDICION = TIPO_DE_CONDICION
  protected OPCIONES_SEGUN_CAMPO: {
    [key: string]: Wrapper<unknown>[];
  } = {
    sexo: SEXOS.map((sexo) => ({
      name: sexo.nombre,
      value: sexo.id,
    })),
  };
  
  protected SELECTABLE_CONDICIONES: Wrapper<SelectableCondicion>[] = [
    {
      name: 'Igual',
      value: SelectableCondicion.IGUAL,
    },
    {
      name: 'Distinto',
      value: SelectableCondicion.DISTINTO,
    },
  ];
  protected STRING_CONDICIONES: Wrapper<StringCondicion>[] = [
    {
      name: 'Igual',
      value: StringCondicion.IGUAL,
    },
    {
      name: 'Distinto',
      value: StringCondicion.DISTINTO,
    },
    {
      name: 'Contiene',
      value: StringCondicion.CONTIENE,
    },
  ];
  protected NUMBER_CONDICIONES: Wrapper<NumberCondicion>[] = [
    {
      name: 'Igual',
      value: NumberCondicion.DISTINTO,
    },
    {
      name: 'Distinto',
      value: NumberCondicion.IGUAL,
    },
    {
      name: 'Mayor que',
      value: NumberCondicion.MAYOR_QUE,
    },
    {
      name: 'Menor que',
      value: NumberCondicion.MENOR_QUE,
    },
  ];
  protected BOOLEAN_CONDICIONES: Wrapper<BooleanCondicion>[] = [
    {
      name: 'Igual',
      value: BooleanCondicion.IGUAL,
    },
    {
      name: 'Distinto',
      value: BooleanCondicion.DISTINTO,
    },
  ];
  protected DATE_CONDICIONES: Wrapper<DateCondicion>[] = [
    {
      name: 'Igual',
      value: DateCondicion.IGUAL,
    },
    {
      name: 'Distinta',
      value: DateCondicion.DISTINTA,
    },
    {
      name: 'Después de',
      value: DateCondicion.DESPUES_DE,
    },
    {
      name: 'Antes de',
      value: DateCondicion.ANTES_DE,
    },
  ];

  protected imprimir_menu: MenuItem[] = [
    {
      label: 'Listados',
      icon: 'pi pi-copy',
    },
  ];

  /* ............................... injectables .............................. */
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /* .................................. data .................................. */
  cantidad_de_estudiantes = this.route.snapshot.data[
    'cantidad_de_estudiantes'
  ] as CantidadDeEstudiantesDTO;
  estudiantes = this.route.snapshot.data[
    'estudiantes'
  ] as Paginated<EstudianteDTO>;

  /* .................................. state ................................. */

  loading = false;

  busqueda_input = new FormControl('');

  ngOnInit(): void {
    this.busqueda_input.valueChanges
      .pipe(debounceTime(200))
      .subscribe((input) => {
        this.busqueda(input + '');
      });
  }

  protected filtros: Filtro[] = [];

  /* .................................. tabla ................................. */

  viewStudent(student: any) {
    console.log('Ver estudiante:', student);
  }

  editStudent(student: any) {
    console.log('Editar estudiante:', student);
  }

  deleteStudent(student: any) {
    console.log('Eliminar estudiante:', student);
  }

  @ViewChildren(Menu) table_row_menus!: QueryList<Menu>;

  toggle_row_menu(event: Event, index: number) {
    event.stopPropagation();
    this.table_row_menus.get(index)?.show(event);
  }

  getActions(estudiante: EstudianteDTO) {
    return [
      {
        label: 'Ver Estudiante',
        icon: 'pi pi-eye',
        command: () => this.viewStudent(estudiante),
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.editStudent(estudiante),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.deleteStudent(estudiante),
      },
    ];
  }

  obtener_color_seccion_class(seccion: string, contraste = false) {
    return obtener_color_seccion_class(seccion, contraste);
  }

  obtener_iniciales(estudiante: EstudianteDTO): string {
    return (
      estudiante.nombres.charAt(0) + estudiante.apellidos.charAt(0)
    ).toUpperCase();
  }

  obtener_nombre(estudiante: EstudianteDTO): string {
    return `${estudiante.nombres.split(' ').at(0)} ${estudiante.apellidos
      .split(' ')
      .at(0)}`;
  }

  /** @internal */ protected html_input_element(target: any): HTMLInputElement {
    return target;
  }

  async busqueda(nombre: string) {
    this.loading = true;

    try {
      this.estudiantes =
        await this.api.client.estudiantes.obtener_estudiantes.query({
          por_nombre: nombre,
          paginacion: {
            limit: this.estudiantes.limit,
          },
        });
    } finally {
      this.loading = false;
    }
  }

  async cargar_estudiantes(event: TableLazyLoadEvent) {
    // Parámetros de paginación
    const page = event.first! / event.rows!;
    const limit = event.rows!;

    if (page + 1 === this.estudiantes.page) return;

    this.loading = true;

    // Llamada a la API
    this.api.client.estudiantes.obtener_estudiantes
      .query({
        paginacion: { page: page + 1, limit },
        por_nombre: this.busqueda_input.value || '',
      })
      .then((data) => {
        this.estudiantes = data;
      })
      .finally(() => (this.loading = false));
  }
  async navigateOnDoubleClick(comands: any[]) {
    await this.router.navigate(comands);
  }

  /* ................................. metodos ................................ */

  add_filtro() {
    this.filtros.push({
      campo: 'sexo',
      condicion: SelectableCondicion.IGUAL,
      valor: ['Pedro'],
    } as Filtro<Selectable<string>>);
  }
  remove_filtro(index: number) {
    if (index >= 0 && index < this.filtros.length) {
      const newFiltros = [...this.filtros];
      newFiltros.splice(index, 1);
      this.filtros = newFiltros;
    }
  }

  /* ................................. helpers ................................ */

  protected getCondicionesSegunCampo(campo: string): Wrapper<Condicion>[] {
    switch (campo) {
      case 'sexo':
        return this.SELECTABLE_CONDICIONES;
      default:
        throw new Error(`Campo desconocido: ${campo}`);
    }
  }
}
