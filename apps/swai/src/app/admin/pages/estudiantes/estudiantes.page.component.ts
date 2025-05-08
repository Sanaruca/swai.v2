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
import {
  BooleanCondicion,
  Condicion,
  CONDICION_MAP,
  DateCondicion,
  ESTADOS_ACADEMICOS,
  EstudianteDTO,
  Filtro,
  NumberCondicion,
  SelectableCondicion,
  SEXOS,
  StringCondicion,
  TIPO_DE_CONDICION,
  TIPOS_DE_SANGRE,
} from '@swai/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { obtener_color_seccion_class } from '../niveles_academicos/utils';
import { ApiService } from '../../../services/api.service';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
    ReactiveFormsModule,
  ],
  templateUrl: './estudiantes.page.component.html',
  styleUrl: './estudiantes.page.component.scss',
})
export class EstudiantesPageComponent implements OnInit {
  /* ................................ contantes ............................... */
  protected INSTITUTION_NAME = environment.INSTITUTION_NAME;

  protected CAMPOS: Wrapper<string>[] = [
    {name: 'Sexo',value: 'sexo'},
    {name: 'Estado académico',value: 'estado_academico'},
    {name: 'Tipo de sangre',value: 'tipo_de_sangre'}
  ];
  protected CAMPO_MAP: Record<string,string> = this.CAMPOS.reduce((acc, c)=> ({...acc, [c.value]: c.name}), {});

  protected TIPO_DE_CONDICION = TIPO_DE_CONDICION;
  protected CONDICION_MAP = CONDICION_MAP;
  protected OPCIONES_SEGUN_CAMPO: {
    [key: string]: Wrapper<unknown>[];
  } = {
    sexo: SEXOS.map((sexo) => ({
      name: sexo.nombre,
      value: sexo.id,
    })),
    estado_academico: ESTADOS_ACADEMICOS.map((it) => ({
      name: it.nombre,
      value: it.id,
    })),
    tipo_de_sangre: TIPOS_DE_SANGRE.map((it) => ({
      name: it.nombre,
      value: it.id,
    })),
  };

  protected SELECTABLE_CONDICIONES: Wrapper<SelectableCondicion>[] = [
    {
      name: 'Igual a',
      value: SelectableCondicion.IGUAL,
    },
    {
      name: 'Distinto de',
      value: SelectableCondicion.DISTINTO,
    },
  ];
  protected STRING_CONDICIONES: Wrapper<StringCondicion>[] = [
    {
      name: 'Igual a',
      value: StringCondicion.IGUAL,
    },
    {
      name: 'Distinto de',
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
      name: 'Distinto de',
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
      name: 'Igual a',
      value: BooleanCondicion.IGUAL,
    },
    {
      name: 'Distinto de',
      value: BooleanCondicion.DISTINTO,
    },
  ];
  protected DATE_CONDICIONES: Wrapper<DateCondicion>[] = [
    {
      name: 'Igual a',
      value: DateCondicion.IGUAL,
    },
    {
      name: 'Distinta de',
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

  protected filtros = new FormArray<
    FormGroup<Record<keyof Filtro, FormControl>>
  >([]);

  protected filtros_activos: Filtro[] = [];

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
        filtros: this.filtros_activos as Filtro<never>[]
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
    this.filtros.push(
      new FormGroup({
        campo: new FormControl(null, [Validators.required]),
        condicion: new FormControl(null, [Validators.required]),
        valor: new FormControl(null, [Validators.required]),
      })
    );
  }
  remove_filtro(index: number) {
    this.filtros.removeAt(index);
  }

  remove_all_filtros() {
    this.filtros.clear();
  }

  async aplicar_filtro(index: number) {
    this.loading = true;

    const filtro = this.filtros.at(index)

    try {
      this.estudiantes =
        await this.api.client.estudiantes.obtener_estudiantes.query({
          filtros: [...this.filtros_activos, filtro.value] as Filtro<never>[],
        });

      this.filtros_activos =  [...this.filtros_activos, filtro.value as Filtro<never>]
      this.filtros.removeAt(index);
    } finally {
      this.loading = false;
    }
  }
  async aplicar_filtros() {
    this.loading = true;

    try {
      this.estudiantes =
        await this.api.client.estudiantes.obtener_estudiantes.query({
          filtros: this.filtros.value as Filtro<never>[],
        });

      this.filtros_activos = this.filtros.value.map((it) => ({
        campo: it.campo,
        condicion: it.condicion,
        valor: it.valor,
      }));

      this.filtros.clear();
    } finally {
      this.loading = false;
    }
  }

  /* ................................. helpers ................................ */

  protected getCondicionesSegunCampo(
    campo: string
  ): Wrapper<Condicion>[] | void {
    switch (campo) {
      case 'sexo':
      case 'estado_academico':
      case 'tipo_de_sangre':
        return this.SELECTABLE_CONDICIONES;
    }
  }

  protected FindValueDeOpciones<T>(value: T, opciones: Wrapper<T>[]) {
    return opciones.find(it=> it.value === value)
  }
}
