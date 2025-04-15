import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Discapacitado,
  ESTADO_ACADEMICO,
  ESTADOS_ACADEMICOS,
  ESTADOS_FEDERALES,
  EstadosDeVenezuelaISO,
  EstudianteDTO,
  EstudianteSchema,
  Municipio,
  NIVELES_ACADEMICOS,
  PersonaSchema,
  Seccion,
  SEXO,
  TIPO_DE_ESTUDIANTE,
  TIPOS_DE_DISCAPACIDAD,
  TIPOS_DE_ESTUDIANTE,
  TIPOS_DE_SANGRE,
} from '@swai/core';
import { EstadoAcademicoTagComponent, SeccionTagComponent, TipoDeEstudianteTagComponent } from '../../../../common/components';
import { ActivatedRoute, Router } from '@angular/router';
import { NivelAcademicoConSeccionesDTO } from '@swai/server';
import { ApiService } from '../../../../services/api.service';
import { validateIf } from '../../../../common/utils/angular/forms/validateif';
import { merge } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { parse, ValiError } from 'valibot';
import { MessageService } from 'primeng/api';

// TODO: renombrar componente
@Component({
  selector: 'aw-registrar-estudiante.page',
  imports: [
    CommonModule,
    StepperModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    SelectButtonModule,
    DatePickerModule,
    ReactiveFormsModule,
    InputMaskModule,
    InputNumberModule,
    EstadoAcademicoTagComponent,
    SeccionTagComponent,
    TipoDeEstudianteTagComponent,
    TextareaModule,
  ],
  templateUrl: './registrar_estudiante.page.component.html',
  styleUrl: './registrar_estudiante.page.component.scss',
})
export class RegistrarEstudiantePageComponent implements OnInit {
  /* ................................. inputs ................................. */
  @Input() modo!: 'registrar' | 'editar';
  @Input() estudiante: EstudianteDTO | null = null;

  /* ............................... injectables .............................. */

  private api = inject(ApiService);
  private toast = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /* ................................. estado ................................. */
  protected niveles_academicos: NivelAcademicoConSeccionesDTO[] =
    this.route.snapshot.data['niveles_academicos'];
  protected municipios: Municipio[] = [];

  protected loadings = {
    municipios: false,
    enviando_datos: false,
  };

  get puede_enviar_formulario(): boolean {
    return (
      this.datos_personales.valid &&
      this.datos_academicos.valid &&
      this.datos_antropometricos.valid &&
      this.datos_de_contacto.valid &&
      this.datos_de_salud.valid
    );
  }

  // TODO: Sospecho que el scrollbar de ngprime esta provocando que se ejecute el detector un numero incecesaro de veces
  get secciones(): Seccion[] {
    const nivel_academico =
      this.datos_academicos.controls.nivel_academico.value;

    if (nivel_academico) {
      return (
        this.niveles_academicos.find((it) => it.numero === +nivel_academico)
          ?.secciones ?? []
      );
    }

    return [];
  }

  protected paso_actual = 1;
  get formulario_actual() {
    switch (this.paso_actual) {
      case 1:
        return this.datos_personales;
      case 2:
        return this.datos_de_contacto;
      case 3:
        return this.datos_academicos;
      case 4:
        return this.datos_de_salud;
      case 5:
        return this.datos_antropometricos;
      default:
        return null;
    }
  }

  /* ............................... constantes ............................... */
  protected TIPOS_DE_DISCAPACIDAD = TIPOS_DE_DISCAPACIDAD;
  protected TIPOS_DE_SANGRE = TIPOS_DE_SANGRE;
  protected TIPOS_DE_ESTUDIANTE = TIPOS_DE_ESTUDIANTE;
  protected TIPO_DE_ESTUDIANTE = TIPO_DE_ESTUDIANTE;
  protected ESTADOS_FEDERALES: Record<'codigo' | 'nombre', string>[] =
    ESTADOS_FEDERALES as any;
  protected ESTADO_ACADEMICO = ESTADO_ACADEMICO;
  protected NIVELES_ACADEMICOS: Record<'numero' | 'nombre', string>[] =
    NIVELES_ACADEMICOS as any;
  protected ESTADOS_ACADEMICOS: Record<'id' | 'nombre', string>[] =
    ESTADOS_ACADEMICOS as any;

  /* ............................... formulario ............................... */

  protected datos_personales = new FormGroup({
    nombres: new FormControl('', { validators: [Validators.required] }),
    apellidos: new FormControl('', { validators: [Validators.required] }),
    cedula: new FormControl<string | null>(null, {
      validators: [Validators.required],
      asyncValidators: [],
    }),
    fecha_de_nacimiento: new FormControl('', {
      validators: [Validators.required],
    }),
    estado_federal: new FormControl('', {
      validators: [Validators.required],
    }),
    municipio_federal: new FormControl('', {
      validators: [Validators.required],
    }),
    sexo: new FormControl<null | SEXO>(null, {
      validators: [Validators.required],
    }),
  });

  protected datos_de_contacto = new FormGroup({
    telefono: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    email: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.email],
    }),
    direccion: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
  });

  protected datos_academicos = new FormGroup({
    tipo_de_estudiante: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    estado_academico: new FormControl<number | null>(null),
    nivel_academico: new FormControl<number | null>(null),
    seccion: new FormControl<string | null>(null),
    fecha_de_inscripcion: new FormControl<string | null>(null),
    fecha_de_egreso: new FormControl<string | null>(null),
  });

  protected datos_de_salud = new FormGroup({
    tipo_de_sangre: new FormControl<number | null>(null, [Validators.required]),
    discapacidad: new FormControl<boolean>(false),
    tipo_de_discapacidad: new FormControl<number | null>(null),
    descripcion_discapacidad: new FormControl<string | null>(null),
  });
  protected datos_antropometricos = new FormGroup({
    peso: new FormControl<string | null>(null),
    estatura: new FormControl<string | null>(null),
    chemise: new FormControl<string | null>(null),
    pantalon: new FormControl<string | null>(null),
  });

  /* .................................. init .................................. */
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const modo: 'registrar' | 'editar' | undefined = data['inputs']?.modo;
      const estudiante: EstudianteDTO | undefined =
        data['inputs']?.estudiante ?? data['estudiante'];

      if (modo && modo !== 'registrar' && modo !== 'editar')
        throw new Error(
          'Debe asignar un `modo` para este componente: "registrar" | "editar"'
        );

      if (modo === 'editar' && !estudiante)
        throw new Error('Debe debe proporcionar `estudiante` en `modo` editar');

      this.modo = modo!;
      this.estudiante = estudiante ?? null;

      this.init_modo(modo!);
    });

    /* ............................ Datos Personales ............................ */

    this.datos_personales.controls.estado_federal.valueChanges.subscribe(
      (estado_federal) => {
        if (estado_federal === null) return;

        this.datos_personales.controls.municipio_federal.setValue(null);

        this.loadings.municipios = true;
        this.api.client.venezuela.obtener_municipios
          .query({
            por_estado: estado_federal as EstadosDeVenezuelaISO,
          })
          .then((municipios) => {
            this.municipios = municipios;
          })
          .finally(() => (this.loadings.municipios = false));
      }
    );

    /* ............................ Datos Academicos ............................ */

    merge(
      this.datos_academicos.controls.estado_academico.valueChanges,
      this.datos_academicos.controls.tipo_de_estudiante.valueChanges
    ).subscribe((tipo_de_estudiante) => {
      if (tipo_de_estudiante === null) return;

      const es_egresado =
        +tipo_de_estudiante === TIPO_DE_ESTUDIANTE.EGRESADO ||
        +tipo_de_estudiante === ESTADO_ACADEMICO.EGRESADO;

      this.datos_academicos.controls.estado_academico.setValidators([
        validateIf(!es_egresado, Validators.required),
      ]);
      this.datos_academicos.controls.fecha_de_inscripcion.setValidators([
        validateIf(!es_egresado, Validators.required),
      ]);
      this.datos_academicos.controls.nivel_academico.setValidators([
        validateIf(!es_egresado, Validators.required),
      ]);
      this.datos_academicos.controls.seccion.setValidators([
        validateIf(!es_egresado, Validators.required),
      ]);
      this.datos_academicos.controls.fecha_de_egreso.setValidators([
        validateIf(es_egresado, Validators.required),
      ]);

      // TODO: al no emitir legan ocaciones donde al cambiar de estado el boton se desabilita
      // TODO: se debe resolver el bucle infinito de cambios

      this.datos_academicos.controls.estado_academico.updateValueAndValidity({
        emitEvent: false,
      });
      this.datos_academicos.controls.fecha_de_inscripcion.updateValueAndValidity(
        { emitEvent: false }
      );
      this.datos_academicos.controls.nivel_academico.updateValueAndValidity({
        emitEvent: false,
      });
      this.datos_academicos.controls.seccion.updateValueAndValidity({
        emitEvent: false,
      });
      this.datos_academicos.controls.fecha_de_egreso.updateValueAndValidity({
        emitEvent: false,
      });
    });

    this.datos_academicos.controls.nivel_academico.valueChanges.subscribe(
      () => {
        const seccion_index = this.secciones.findIndex(
          (it) => it.seccion === this.datos_academicos.controls.seccion.value
        );

        if (seccion_index === -1) {
          this.datos_academicos.controls.seccion.setValue(null);
        }
      }
    );

    /* ............................. Datos de salud ............................. */

    this.datos_de_salud.controls.discapacidad.valueChanges.subscribe(
      (posee_discapacidad) => {
        this.datos_de_salud.controls.tipo_de_discapacidad.setValidators([
          validateIf(!!posee_discapacidad, Validators.required),
        ]);
        this.datos_de_salud.controls.tipo_de_discapacidad.updateValueAndValidity();
      }
    );
  }

  /* ................................. metodos ................................ */

  private init_modo(modo: 'editar' | 'registrar') {
    if (modo === 'editar') {
      const estudiante = this.estudiante!;

      this.municipios = [estudiante.municipio_de_nacimiento as any];

      this.datos_personales.setValue({
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        cedula: estudiante.cedula + '',
        fecha_de_nacimiento: estudiante.fecha_de_nacimiento as any,
        estado_federal:
          estudiante.municipio_de_nacimiento.estado_federal.codigo,
        municipio_federal: estudiante.municipio_de_nacimiento.codigo,
        sexo: estudiante.sexo,
      });

      this.datos_personales.controls.cedula.disable();
      this.datos_personales.controls.estado_federal.disable();
      this.datos_personales.controls.municipio_federal.disable();
      this.datos_personales.controls.fecha_de_nacimiento.disable();
      this.datos_personales.controls.sexo.disable();

      this.datos_de_contacto.setValue({
        telefono: estudiante.telefono,
        email: estudiante.correo,
        direccion: estudiante.direccion ?? null,
      });

      this.datos_academicos.setValue({
        tipo_de_estudiante: estudiante.tipo.id!,
        estado_academico: estudiante.estado_academico.id,
        nivel_academico: estudiante.nivel_academico.numero,
        seccion: estudiante.seccion?.seccion ?? null,
        fecha_de_inscripcion: estudiante.fecha_de_inscripcion as any,
        fecha_de_egreso: estudiante.fecha_de_egreso as any,
      });

      this.datos_de_salud.setValue({
        tipo_de_sangre: estudiante.tipo_de_sangre.id,
        discapacidad: !!estudiante.discapacidad,
        tipo_de_discapacidad:
          estudiante.discapacidad?.tipo_de_discapacidad.id ?? null,
        descripcion_discapacidad: estudiante.discapacidad?.descripcion ?? null,
      });
    }
  }

  protected enviar_datos() {
    if (this.loadings.enviando_datos) return;
    switch (this.modo) {
      case 'editar':
        return this.actualizar();
      case 'registrar':
        return this.registrar();
    }
  }

  /* ............................... actualizar ............................... */
  private async actualizar() {
    this.loadings.enviando_datos = true;

    const discapacidad: Omit<Discapacitado, 'cedula'> | null = this
      .datos_de_salud.controls.discapacidad.value
      ? {
          descripcion:
            this.datos_de_salud.controls.descripcion_discapacidad.value,
          tipo_de_discapacidad:
            this.datos_de_salud.controls.tipo_de_discapacidad.value!,
        }
      : null;

    try {
      await this.api.client.estudiantes.actualizar_estudiante.mutate({
        estudiante: this.estudiante!.cedula,
        actualizacion: {
          seccion: this.datos_academicos.controls.seccion.value as any,
          direccion: this.datos_de_contacto.controls.direccion.value!,
          nivel_academico:
            +this.datos_academicos.controls.nivel_academico.value!,
          tipo: +this.datos_academicos.controls.tipo_de_estudiante.value!,
          correo: this.datos_de_contacto.controls.email.value!,
          tipo_de_sangre: +this.datos_de_salud.controls.tipo_de_sangre.value!,
          nombres: this.datos_personales.controls.nombres.value!,
          apellidos: this.datos_personales.controls.apellidos.value!,
          discapacidad,
          telefono: this.datos_de_contacto.controls.telefono.value!,
          fecha_de_egreso:
            parse(
              EstudianteSchema.entries.fecha_de_egreso,
              this.datos_academicos.controls.fecha_de_egreso.value
            ) ?? null,
          fecha_de_inscripcion: parse(
            EstudianteSchema.entries.fecha_de_inscripcion,
            this.datos_academicos.controls.fecha_de_inscripcion.value
          ),
          estado_academico:
            +this.datos_academicos.controls.estado_academico.value!,
        },
      });

      this.toast.add({
        summary: 'Estudiante ha sido actualizado con exito con exito',
        severity: 'success',
      });

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([`/admin/estudiantes/${this.estudiante!.cedula}`]);
      });
    } finally {
      this.loadings.enviando_datos = false;
    }
  }

  /* ................................ registrar ............................... */
  private async registrar() {
    this.loadings.enviando_datos = true;

    const discapacidad: Omit<Discapacitado, 'cedula'> | null = this
      .datos_de_salud.controls.discapacidad.value
      ? {
          descripcion:
            this.datos_de_salud.controls.descripcion_discapacidad.value,
          tipo_de_discapacidad:
            this.datos_de_salud.controls.tipo_de_discapacidad.value!,
        }
      : null;

    try {
      const estudiante =
        await this.api.client.estudiantes.registrar_estudiante.mutate({
          direccion: this.datos_de_contacto.controls.direccion.value!,
          nivel_academico:
            +this.datos_academicos.controls.nivel_academico.value!,
          tipo: +this.datos_academicos.controls.tipo_de_estudiante.value!,
          sexo: this.datos_personales.controls.sexo.value!,
          correo: this.datos_de_contacto.controls.email.value!,
          tipo_de_sangre: +this.datos_de_salud.controls.tipo_de_sangre.value!,
          cedula: +this.datos_personales.controls.cedula.value!,
          nombres: this.datos_personales.controls.nombres.value!,
          apellidos: this.datos_personales.controls.apellidos.value!,
          discapacidad,
          fecha_de_nacimiento: parse(
            PersonaSchema.entries.fecha_de_nacimiento,
            this.datos_personales.controls.fecha_de_nacimiento.value
          ),
          telefono: this.datos_de_contacto.controls.telefono.value!,
          fecha_de_egreso:
            parse(
              EstudianteSchema.entries.fecha_de_egreso,
              this.datos_academicos.controls.fecha_de_egreso.value
            ) ?? null,
          fecha_de_inscripcion: parse(
            EstudianteSchema.entries.fecha_de_inscripcion,
            this.datos_academicos.controls.fecha_de_inscripcion.value
          ),
          municipio_de_nacimiento:
            this.datos_personales.controls.municipio_federal.value!,
          estado_academico:
            +this.datos_academicos.controls.estado_academico.value!,
        });

      this.toast.add({
        summary: 'Estudiante ha sido registrado con exito',
        severity: 'success',
      });

      this.router.navigate(['/admin/estudiantes', estudiante.cedula]);
    } catch (error) {
      console.error({ error });

      if (error instanceof ValiError) {
        this.toast.add({
          severity: 'error',
          summary: 'Ha courrido un error al validar los datos',
          detail: 'Verifique los datos del formulario e intente nuevamente',
        });
      }
    }
    this.loadings.enviando_datos = false;
  }
}
