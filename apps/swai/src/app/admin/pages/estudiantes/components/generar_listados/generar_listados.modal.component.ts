import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { Divider } from 'primeng/divider';
import {
  ESTADO_ACADEMICO,
  Filtro,
  generar_listado_de_estudiantes,
  NIVEL_ACADEMICO,
  NumberCondicion,
  StringCondicion,
} from '@swai/core';
import { ApiService } from '../../../../../services/api.service';
import { NivelAcademicoConSeccionesDTO } from '@swai/server';

// TODO:

@Component({
  selector: 'aw-modal-generar-listados',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    CheckboxModule,
    Divider,
  ],
  templateUrl: './generar_listados.modal.component.html',
  styleUrl: './generar_listados.modal.component.scss',
})
export class GenerarListadosModalComponent implements OnInit {
  /* ............................... injectables .............................. */

  private api = inject(ApiService);

  @Input() protected visible = false;

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  /* .................................. state ................................. */

  protected paso_actual = 1;

  protected niveles_academicos = [] as NivelAcademicoConSeccionesDTO[];

  protected loading = false;

  protected form = new FormGroup({
    tipo_de_listado: new FormControl<'por_seccion' | 'por_nivel' | null>(null, {
      validators: [Validators.required],
    }),
    niveles_academicos: new FormArray(
      [
        new FormGroup({
          nivel_academico: new FormControl<number>(NIVEL_ACADEMICO.Primero),
          selected: new FormControl<boolean>(false),
        }),
        new FormGroup({
          nivel_academico: new FormControl<number>(NIVEL_ACADEMICO.Segundo),
          selected: new FormControl<boolean>(false),
        }),
        new FormGroup({
          nivel_academico: new FormControl<number>(NIVEL_ACADEMICO.Tercero),
          selected: new FormControl<boolean>(false),
        }),
        new FormGroup({
          nivel_academico: new FormControl<number>(NIVEL_ACADEMICO.Cuarto),
          selected: new FormControl<boolean>(false),
        }),
        new FormGroup({
          nivel_academico: new FormControl<number>(NIVEL_ACADEMICO.Quinto),
          selected: new FormControl<boolean>(false),
        }),
      ],
      {
        validators: [this.check_niveles_academicos],
      }
    ),
    secciones_academicas: new FormGroup<{
      [key: string]: FormGroup<{
        seccion: FormControl<string>;
        selected: FormControl<boolean>;
      }>;
    }>({}),

    todo_nivel: new FormControl<boolean>(false),

    check_secciones_academicas: new FormGroup({
      todas: new FormControl<boolean>(false),
      todo_primer_nivel: new FormControl<boolean>(false),
      todo_segundo_nivel: new FormControl<boolean>(false),
      todo_tercer_nivel: new FormControl<boolean>(false),
      todo_cuarto_nivel: new FormControl<boolean>(false),
      todo_quinto_nivel: new FormControl<boolean>(false),
    }),
  });

  /* ................................. metodos ................................ */

  protected generar_listados() {
    if (this.form.controls.tipo_de_listado.value === 'por_nivel') {
      this.loading = true
      Promise.all(
        this.form.controls.niveles_academicos.controls
          .filter((nivel_academico) => nivel_academico.controls.selected.value)
          .map((nivel_academico) =>
            this.api.client.estudiantes.obtener_estudiantes.query({
              filtros: [
                {
                  campo: 'nivel_academico',
                  condicion: NumberCondicion.IGUAL,
                  valor: nivel_academico.controls.nivel_academico.value,
                },
                {
                  campo: 'estado_academico',
                  condicion: NumberCondicion.IGUAL,
                  valor: ESTADO_ACADEMICO.ACTIVO,
                },
              ],
              paginacion: {
                page: 1,
                limit: 100,
              },
            })
          )
      ).then((estudiantes) => {
        this.loading = false;
        estudiantes.forEach((estudiantes) => {

          const nivel_academico = estudiantes.data[0].nivel_academico;
          const titulo = `Listado de Estudiantes de ${nivel_academico.nombre}`;
          const filename = `listado_de_estudiantes_${nivel_academico.nombre.toLowerCase().replace(/\/s/g, '_')}`;

          generar_listado_de_estudiantes(estudiantes.data, titulo, filename);
        });
      }).finally(() => {
        this.loading = false;
      });
    }

    if (this.form.controls.tipo_de_listado.value === 'por_seccion') {
      const filtros_por_seccion = Object.keys(
        this.form.controls.secciones_academicas.controls
      )
        .filter(
          (seccion) =>
            this.form.controls.secciones_academicas.controls[seccion].controls
              .selected.value
        )
        .map<Filtro>((seccion) => ({
          campo: 'seccion',
          condicion: StringCondicion.IGUAL,
          valor: seccion,
        }));

      this.loading = true;

      Promise.all(
        filtros_por_seccion.map((filtro) =>
          this.api.client.estudiantes.obtener_estudiantes.query({
            filtros: [
              filtro as Filtro<never>,
              {
                campo: 'estado_academico',
                condicion: NumberCondicion.IGUAL,
                valor: ESTADO_ACADEMICO.ACTIVO,
              },
            ],
            paginacion: {
              page: 1,
              limit: 100,
            },
          })
        )
      )
        .then((resultados) => {
          resultados.forEach((estudiantes) => {
            if (!estudiantes.data.length) {
              return;
            }

            const nivel_academico = estudiantes.data[0].nivel_academico;
            const seccion = estudiantes.data[0].seccion!;

            generar_listado_de_estudiantes(
              estudiantes.data,
              `${nivel_academico.nombre} seccion "${seccion.seccion}"`,
              `listado_${seccion.id}`
            );
          });
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  /* .............................. ciclo de vida ............................. */

  async ngOnInit() {
    try {
      const niveles_academicos =
        await this.api.client.institucion.obtener_niveles_academicos.query();

      this.niveles_academicos = niveles_academicos;

      const secciones = niveles_academicos.flatMap(
        ({ secciones }) => secciones
      );

      this.form.controls.secciones_academicas = new FormGroup(
        secciones.reduce(
          (acc, seccion) => ({
            ...acc,
            [seccion.id]: new FormGroup({
              seccion: new FormControl(seccion.id),
              selected: new FormControl(false),
            }),
          }),
          {}
        ),
        {
          validators: [this.check_secciones_academicas],
        }
      );
    } finally {
      /* empty */
    }

    this.form.controls.tipo_de_listado.valueChanges.subscribe((value) => {
      if (value) {
        this.paso_actual = 2;
      }
    });

    this.form.controls.todo_nivel.valueChanges.subscribe((value) => {
      this.form.controls.niveles_academicos.value.forEach((_, i) =>
        this.form.controls.niveles_academicos
          .at(i)
          .controls.selected.setValue(value, { emitEvent: false })
      );
    });

    this.form.controls.niveles_academicos.valueChanges.subscribe((value) => {
      this.form.controls.todo_nivel.setValue(
        value.every(({ selected }) => selected),
        { emitEvent: false }
      );
    });

    this.form.controls.secciones_academicas.valueChanges.subscribe((value) => {
      const secciones = Object.keys(value);

      const primer_nivel = secciones.filter((key) => key.startsWith('1'));
      const segundo_nivel = secciones.filter((key) => key.startsWith('2'));
      const tercer_nivel = secciones.filter((key) => key.startsWith('3'));
      const cuarto_nivel = secciones.filter((key) => key.startsWith('4'));
      const quinto_nivel = secciones.filter((key) => key.startsWith('5'));

      const todo_primer_nivel = primer_nivel.every(
        (key) => value[key!]!.selected
      );
      const todo_segundo_nivel = segundo_nivel.every(
        (key) => value[key!]!.selected
      );
      const todo_tercer_nivel = tercer_nivel.every(
        (key) => value[key!]!.selected
      );
      const todo_cuarto_nivel = cuarto_nivel.every(
        (key) => value[key!]!.selected
      );
      const todo_quinto_nivel = quinto_nivel.every(
        (key) => value[key!]!.selected
      );
      const todas =
        todo_primer_nivel &&
        todo_segundo_nivel &&
        todo_tercer_nivel &&
        todo_cuarto_nivel &&
        todo_quinto_nivel;

      this.form.controls.check_secciones_academicas
        .get('todo_primer_nivel')
        ?.setValue(todo_primer_nivel, { emitEvent: false });
      this.form.controls.check_secciones_academicas
        .get('todo_segundo_nivel')
        ?.setValue(todo_segundo_nivel, { emitEvent: false });
      this.form.controls.check_secciones_academicas
        .get('todo_tercer_nivel')
        ?.setValue(todo_tercer_nivel, { emitEvent: false });
      this.form.controls.check_secciones_academicas
        .get('todo_cuarto_nivel')
        ?.setValue(todo_cuarto_nivel, { emitEvent: false });
      this.form.controls.check_secciones_academicas
        .get('todo_quinto_nivel')
        ?.setValue(todo_quinto_nivel, { emitEvent: false });

      this.form.controls.check_secciones_academicas
        .get('todas')
        ?.setValue(todas, { emitEvent: false });
    });

    this.form.controls.check_secciones_academicas
      .get('todas')
      ?.valueChanges.subscribe((value) => {
        this.form.controls.check_secciones_academicas
          .get('todo_primer_nivel')
          ?.setValue(value, { emitEvent: true });
        this.form.controls.check_secciones_academicas
          .get('todo_segundo_nivel')
          ?.setValue(value, { emitEvent: true });
        this.form.controls.check_secciones_academicas
          .get('todo_tercer_nivel')
          ?.setValue(value, { emitEvent: true });
        this.form.controls.check_secciones_academicas
          .get('todo_cuarto_nivel')
          ?.setValue(value, { emitEvent: true });
        this.form.controls.check_secciones_academicas
          .get('todo_quinto_nivel')
          ?.setValue(value, { emitEvent: true });
      });

    this.form.controls.check_secciones_academicas
      .get('todo_primer_nivel')
      ?.valueChanges.subscribe((value) => {
        Object.keys(this.form.controls.secciones_academicas.controls)
          .filter((key) => key.startsWith('1'))
          .forEach((key) => {
            this.form.controls.secciones_academicas.controls[
              key
            ].controls.selected.setValue(!!value);
          });
      });

    this.form.controls.check_secciones_academicas
      .get('todo_segundo_nivel')
      ?.valueChanges.subscribe((value) => {
        Object.keys(this.form.controls.secciones_academicas.controls)
          .filter((key) => key.startsWith('2'))
          .forEach((key) => {
            this.form.controls.secciones_academicas.controls[
              key
            ].controls.selected.setValue(!!value);
          });
      });

    this.form.controls.check_secciones_academicas
      .get('todo_tercer_nivel')
      ?.valueChanges.subscribe((value) => {
        Object.keys(this.form.controls.secciones_academicas.controls)
          .filter((key) => key.startsWith('3'))
          .forEach((key) => {
            this.form.controls.secciones_academicas.controls[
              key
            ].controls.selected.setValue(!!value);
          });
      });

    this.form.controls.check_secciones_academicas
      .get('todo_cuarto_nivel')
      ?.valueChanges.subscribe((value) => {
        Object.keys(this.form.controls.secciones_academicas.controls)
          .filter((key) => key.startsWith('4'))
          .forEach((key) => {
            this.form.controls.secciones_academicas.controls[
              key
            ].controls.selected.setValue(!!value);
          });
      });

    this.form.controls.check_secciones_academicas
      .get('todo_quinto_nivel')
      ?.valueChanges.subscribe((value) => {
        Object.keys(this.form.controls.secciones_academicas.controls)
          .filter((key) => key.startsWith('5'))
          .forEach((key) => {
            this.form.controls.secciones_academicas.controls[
              key
            ].controls.selected.setValue(!!value);
          });
      });
  }

  /* ................................. getters ................................ */

  get formulario_actual() {
    switch (this.paso_actual) {
      case 1:
        return this.form.controls.tipo_de_listado;
      case 2:
        return this.form.controls.tipo_de_listado.value === 'por_nivel'
          ? this.form.controls.niveles_academicos
          : this.form.controls.secciones_academicas;
    }

    return;
  }

  protected get secciones_selecionadas(): string {

    if (this.form.controls.check_secciones_academicas.value.todas) {
      return 'Todas las secciones de todos los niveles';
    }
    
    return Object.keys(this.form.controls.secciones_academicas.value).filter((key) => this.form.controls.secciones_academicas.value[key]?.selected).join(', ');
  }

  protected get niveles_selecionados(): string {

    if (this.form.controls.todo_nivel.value) {
      return 'Todos los niveles académicos';
    }

    return this.form.controls.niveles_academicos.controls.filter((control) => control.get('selected')?.value).map((control) => control.get('nivel_academico')?.value).join(', ');
  }

  /* ................................. helpers ................................ */

  protected check_secciones_academicas(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!(control instanceof FormGroup))
      throw new Error('`control` debe ser un `FormGroup`');

    const some = Object.keys(control.controls).some((key) => {
      return control.get(key)?.get('selected')?.value;
    });

    if (!some) return { required: true };

    return null;
  }

  protected check_niveles_academicos(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!(control instanceof FormArray))
      throw new Error('`control` debe ser un `FormArray`');

    const some = control.controls.some((control) => {
      return control.get('selected')?.value;
    });

    if (!some) return { required: true };

    return null;
  }
}
