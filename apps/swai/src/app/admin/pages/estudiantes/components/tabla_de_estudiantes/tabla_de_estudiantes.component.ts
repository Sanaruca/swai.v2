import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Paginated } from '@swai/server';
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
  TIPOS_DE_ESTUDIANTE,
  TIPOS_DE_SANGRE,
} from '@swai/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { ApiService } from '../../../../../services/api.service';
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
} from '../../../../../common/components';
import { MomentModule } from 'ngx-moment';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import { SelectModule } from 'primeng/select';
import { PopoverModule } from 'primeng/popover';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { NombrePipe } from '../../../../../common/pipes/nombre.pipe';

interface Wrapper<T> {
  name: string;
  value: T;
}

@Component({
  selector: 'aw-tabla-de-estudiantes',
  imports: [
    CommonModule,
    ButtonModule,
    RouterLink,
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
    ChipModule,
    SelectModule,
    ReactiveFormsModule,
    PopoverModule,
    DatePickerModule,
    InputNumberModule,
    NombrePipe,
  ],
  templateUrl: './tabla_de_estudiantes.component.html',
  styleUrl: './tabla_de_estudiantes.component.sass',
})
export class TablaDeEstudiantesComponent {

  @Input() filtros_estaticos: Filtro[] = []

  get filtros(): Filtro[] {
    return [...this.filtros_estaticos, ...this.filtros_activos]
  }


  /* ............................... injectables .............................. */
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /* ............................... constantes ............................... */
  protected CAMPOS: (Wrapper<string> & { type: TIPO_DE_CONDICION })[] = [
    { name: 'Nombres', value: 'nombres', type: TIPO_DE_CONDICION.STRING },
    { name: 'Apellidos', value: 'apellidos', type: TIPO_DE_CONDICION.STRING },
    { name: 'Sexo', value: 'sexo', type: TIPO_DE_CONDICION.SELECTABLE },
    {
      name: 'Estado académico',
      value: 'estado_academico',
      type: TIPO_DE_CONDICION.SELECTABLE,
    },
    {
      name: 'Tipo de sangre',
      value: 'tipo_de_sangre',
      type: TIPO_DE_CONDICION.SELECTABLE,
    },
    { name: 'Tipo', value: 'tipo', type: TIPO_DE_CONDICION.SELECTABLE },
    { name: 'Estatura', value: 'estatura', type: TIPO_DE_CONDICION.NUMBER },
    { name: 'Peso', value: 'peso', type: TIPO_DE_CONDICION.NUMBER },
    { name: 'Chemise', value: 'chemise', type: TIPO_DE_CONDICION.NUMBER },
    {
      name: 'Fecha de inscripción',
      value: 'fecha_de_inscripcion',
      type: TIPO_DE_CONDICION.DATE,
    },
    {
      name: 'Fecha de nacimiento',
      value: 'fecha_de_nacimiento',
      type: TIPO_DE_CONDICION.DATE,
    },
  ];
  protected CAMPO_MAP: Record<string, string> = this.CAMPOS.reduce(
    (acc, c) => ({ ...acc, [c.value]: c.name }),
    {}
  );
  protected TIPO_DE_CONDICION_SEGUN_CAMPO: Record<string, TIPO_DE_CONDICION> =
    this.CAMPOS.reduce((acc, c) => ({ ...acc, [c.value]: c.type }), {});

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
    tipo: TIPOS_DE_ESTUDIANTE.map((it) => ({
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
      value: NumberCondicion.IGUAL,
    },
    {
      name: 'Distinto de',
      value: NumberCondicion.DISTINTO,
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

  protected CONDICIONES_SEGUN_CAMPO: Record<string, Wrapper<Condicion>[]> =
    this.CAMPOS.reduce((map, c) => {
      let condiciones: Wrapper<Condicion>[] = [];

      switch (c.type) {
        case TIPO_DE_CONDICION.BOOLEAN:
          condiciones = this.BOOLEAN_CONDICIONES;
          break;
        case TIPO_DE_CONDICION.DATE:
          condiciones = this.DATE_CONDICIONES;
          break;
        case TIPO_DE_CONDICION.NUMBER:
          condiciones = this.NUMBER_CONDICIONES;
          break;
        case TIPO_DE_CONDICION.SELECTABLE:
          condiciones = this.SELECTABLE_CONDICIONES;
          break;
        case TIPO_DE_CONDICION.STRING:
          condiciones = this.STRING_CONDICIONES;
          break;
      }

      return { ...map, [c.value]: condiciones };
    }, {});

  /* .................................. state ................................. */

  estudiantes = this.route.snapshot.data[
    'estudiantes'
  ] as Paginated<EstudianteDTO>;

  loading = false;

  protected filtros_form = new FormArray<
    FormGroup<Record<keyof Filtro, FormControl>>
  >([]);

  protected filtros_activos_form = new FormArray<
    FormGroup<Record<keyof Filtro, FormControl>>
  >([]);

  protected filtros_activos = [] as Filtro[];

  /* .............................. ciclo de vida ............................. */

  /* ................................. metodos ................................ */

  async cargar_estudiantes(event: TableLazyLoadEvent) {
    //TODO: implementar
  }

  add_filtro() {
    this.filtros_form.push(
      new FormGroup({
        campo: new FormControl(null, [Validators.required]),
        condicion: new FormControl(null, [Validators.required]),
        valor: new FormControl(null, [Validators.required]),
      })
    );
  }

  remove_filtro(index: number) {
    this.filtros_form.removeAt(index);
  }

  remove_filtro_activo(index: number) {
    this.filtros_activos_form.removeAt(index);
    this.filtros_activos.splice(index, 1)
    this.filtros_activos = [...this.filtros_activos]
    this.aplicar_filtros(this.filtros);
  }

  remove_all_filtros() {
    this.filtros_form.clear();
  }

  async aplicar_filtro(index: number) {
    this.loading = true;

    const filtro = this.filtros_form.at(index);

    try {
      this.estudiantes =
        await this.api.client.estudiantes.obtener_estudiantes.query({
          filtros: [
            ...this.filtros_activos_form.value,
            filtro.value,
          ] as Filtro<never>[],
        });

      this.filtros_activos_form.push(
        new FormGroup({
          campo: new FormControl(filtro.controls.campo.value),
          condicion: new FormControl(filtro.controls.condicion.value),
          valor: new FormControl(filtro.controls.valor.value),
        })
      );
      this.filtros_activos = JSON.parse(
        JSON.stringify(this.filtros_activos_form.value)
      );

      this.filtros_form.removeAt(index);
    } finally {
      this.loading = false;
    }
  }
  async aplicar_filtros_form() {
    const new_filtros = [...this.filtros, ...this.filtros_form.value];

    await this.aplicar_filtros(new_filtros as Filtro<never>[]);

    this.filtros_form.clear();
  }

  async aplicar_filtros<C extends string>(filtros: Filtro<C>[]) {
    this.loading = true;
    try {
      this.estudiantes =
        await this.api.client.estudiantes.obtener_estudiantes.query({
          filtros: filtros as Filtro<never>[],
        });

      this.filtros_activos = filtros;
      this.filtros_activos_form = new FormArray(
        filtros.map(
          (f) =>
            new FormGroup({
              campo: new FormControl(f.campo),
              condicion: new FormControl(f.condicion),
              valor: new FormControl(f.valor),
            })
        )
      );
    } finally {
      this.loading = false;
    }
  }

  /* ................................. helpers ................................ */

  protected findValueDeOpciones<T>(value: T, opciones: Wrapper<T>[]) {
    return opciones.find((it) => it.value === value);
  }

  // TODO: esta funcion esta ejecutandoce veces inesesarias
  protected comparar_objetos(a: object, b: object) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  async navigateOnDoubleClick(comands: any[]) {
    await this.router.navigate(comands);
  }
}
