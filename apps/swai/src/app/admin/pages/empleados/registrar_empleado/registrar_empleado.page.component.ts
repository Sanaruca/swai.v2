import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AdministrativoDTO,
  CentroDeVotacion,
  EmpleadoDTO,
  ESPECIALIDADES,
  ESTADOS_CIVILES,
  ESTADOS_FEDERALES,
  EstadosDeVenezuelaISO,
  ISwaiError,
  Municipio,
  NIVELES_ACADEMICOS,
  Parroquia,
  PlantelEducativo,
  ProfesorDTO,
  SEXO,
  SwaiErrorCode,
  TIPO_DE_EMPLEADO,
  TIPOS_DE_DISCAPACIDAD,
  TIPOS_DE_EMPLEADO,
  TIPOS_DE_SANGRE,
  TituloPregrado,
} from '@swai/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { NivelAcademicoTagComponent, SeccionTagComponent, TipoDeEmpleadoTagComponent } from '../../../../common/components';
import { validateIf } from '../../../../common/utils/angular/forms/validateif';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { ApiService } from '../../../../services/api.service';
import { date, parse } from 'valibot';
import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { debounceTime } from 'rxjs';
import { TRPCClientError } from '@trpc/client';
import { NivelAcademicoConSeccionesDTO } from '@swai/server';
import { Tag } from 'primeng/tag';

// TODO: Renombrar componente
@Component({
  selector: 'aw-registrar-empleado.page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    InputMaskModule,
    SelectButtonModule,
    TextareaModule,
    SelectModule,
    TipoDeEmpleadoTagComponent,
    PasswordModule,
    IconFieldModule,
    InputIconModule,
    NivelAcademicoTagComponent,
    SeccionTagComponent,
    Tag
  ],
  templateUrl: './registrar_empleado.page.component.html',
  styleUrl: './registrar_empleado.page.component.scss',
})
export class RegistrarEmpleadoPageComponent implements OnInit {
  /* ................................ contantes ............................... */
  INSTITUTION_NAME = 'environment.INSTITUTION_NAME';

  /* ................................. inputs ................................. */
  @Input() modo!: 'registrar' | 'editar';
  @Input() empleado: EmpleadoDTO | AdministrativoDTO | ProfesorDTO | null =
    null;

  /* ............................... constantes ............................... */

  protected ESPECIALIDADES = ESPECIALIDADES;
  protected TIPO_DE_EMPLEADO = TIPO_DE_EMPLEADO;
  protected NIVELES_ACADEMICOS = NIVELES_ACADEMICOS.slice(0,5);
  protected TIPOS_DE_EMPLEADO = TIPOS_DE_EMPLEADO;
  protected ESTADOS_FEDERALES = ESTADOS_FEDERALES;
  protected TIPOS_DE_DISCAPACIDAD = TIPOS_DE_DISCAPACIDAD;
  protected TIPOS_DE_SANGRE = TIPOS_DE_SANGRE;
  protected ESTADOS_CIVILES = ESTADOS_CIVILES;

  /* ............................... injectables .............................. */

  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(MessageService);

  /* .............................. data inicial .............................. */

  protected titulos_de_pregrado = this.route.snapshot.data[
    'titulos_de_pregrado'
  ] as TituloPregrado[];

  protected municipios = this.route.snapshot.data['municipios'] as Municipio[];

  protected parroquias = this.route.snapshot.data['parroquias'] as Parroquia[];
  protected niveles_academicos = this.route.snapshot.data['niveles_academicos'] as NivelAcademicoConSeccionesDTO[];

  protected centros_de_votacion = [] as CentroDeVotacion[];

  /* .................................. state ................................. */

  protected paso_actual = 1;

  protected plantel: PlantelEducativo | null = null;

  protected loadings = {
    enviando: false,
    centros_de_votacion: false,
    plantel: false,
  };

  /* ................................ computed ................................ */

  get formulario_actual(): FormGroup | void {
    switch (this.paso_actual) {
      case 1:
        return this.datos_personales;
      case 2:
        return this.centro_de_votacion;
      case 3:
        return this.datos_de_empleo;
      case 4:
        return this.datos_de_contacto;
      case 5:
        return this.datos_de_salud;
      default:
        break;
    }
  }

  get puede_enviar_formulario(): boolean {
    return (
      this.datos_personales.valid &&
      this.centro_de_votacion.valid &&
      this.datos_de_empleo.valid &&
      this.datos_de_contacto.valid &&
      this.datos_de_salud.valid
    );
  }


  get SECCIONES() {
    const nivel_academico  = this.datos_de_empleo.controls.docente_guia_nivel_academico.value

    if (nivel_academico) {
      return (
        this.niveles_academicos.find((it) => it.numero === nivel_academico)
          ?.secciones ?? []
      );
    }

    return []
  }

  /* ............................ Datos personales ............................ */

  protected datos_personales = new FormGroup({
    nombres: new FormControl('', { validators: [Validators.required] }),
    apellidos: new FormControl('', { validators: [Validators.required] }),
    estado_civil: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    cedula: new FormControl<string | null>(null, {
      validators: [Validators.required],
      asyncValidators: [],
    }),
    fecha_de_nacimiento: new FormControl('', {
      validators: [Validators.required],
    }),
    sexo: new FormControl<null | SEXO>(null, {
      validators: [Validators.required],
    }),
  });

  /* ........................... Centro de votacion ........................... */
  protected centro_de_votacion = new FormGroup({
    estado_federal: new FormControl(
      { value: EstadosDeVenezuelaISO.MONAGAS, disabled: true },
      [Validators.required]
    ),
    municipio: new FormControl<string | null>(
      { value: 'N-08', disabled: true },
      [Validators.required]
    ),
    parroquia: new FormControl<string | null>(null, [Validators.required]),
    centro: new FormControl<string | null>(null, [Validators.required]),
  });

  /* ........................... Datos de empleo .......................... */

  protected datos_de_empleo = new FormGroup({
    tipo_de_empleado: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    fecha_de_ingreso: new FormControl('', [Validators.required]),
    rif: new FormControl('', { validators: [Validators.required] }),
    codigo_carnet_patria: new FormControl('', {
      validators: [Validators.required],
    }),
    titulo_de_pregrado: new FormControl<number | null>(null),
    /* ................................. docente ................................ */
    especialidad: new FormControl<number | null>(null),
    plantel_de_dependencia: new FormControl<string | null>('S0347D1608'),
    docente_guia: new FormControl<boolean>(false),
    docente_guia_nivel_academico: new FormControl<number | null>(null),
    docente_guia_seccion: new FormControl<string | null>(null),

  });

  /* ............................ Datos de contacto ........................... */

  protected datos_de_contacto = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    telefono: new FormControl('', { validators: [Validators.required] }),
    direccion: new FormControl('', { validators: [Validators.required] }),
  });

  /* ............................. Datos de salud ............................. */
  protected datos_de_salud = new FormGroup({
    tipo_de_sangre: new FormControl<number | null>(null, [Validators.required]),
    discapacidad: new FormControl<boolean>(false),
    tipo_de_discapacidad: new FormControl<number | null>(null),
    descripcion_discapacidad: new FormControl<string | null>(null),
  });
  /* ................................. on init ................................ */

  ngOnInit(): void {

    this.datos_de_empleo.controls.docente_guia.valueChanges.subscribe((es_docente_guia) => {
      
        this.datos_de_empleo.controls.docente_guia_nivel_academico.setValidators([
          validateIf(!!es_docente_guia, Validators.required),
        ]);
        this.datos_de_empleo.controls.docente_guia_seccion.setValidators([
          validateIf(!!es_docente_guia, Validators.required),
        ]);

        this.datos_de_empleo.controls.docente_guia_nivel_academico.updateValueAndValidity();
        this.datos_de_empleo.controls.docente_guia_seccion.updateValueAndValidity();

    })

    this.datos_de_empleo.controls.docente_guia_nivel_academico.valueChanges.subscribe((nivel_academico) => {

      if (!nivel_academico) return;

      const seccion = this.datos_de_empleo.controls.docente_guia_seccion.value
      if (!seccion) return
      if (!this.SECCIONES.some(it => it.nivel_academico === nivel_academico && it.seccion === seccion)) {
        this.datos_de_empleo.controls.docente_guia_seccion.setValue(null);
      }
      
    })


    this.datos_de_empleo.controls.plantel_de_dependencia.valueChanges
      .pipe(debounceTime(200))
      .subscribe(async (v) => {
        if (!v) return;
        this.loadings.plantel = true;
        try {
          this.plantel =
            await this.api.client.venezuela.obtener_plantel_educativo.query(v);
        } catch (error: unknown) {
          if (error instanceof TRPCClientError) {
            const swai_error = error.data!.swai_error as ISwaiError;
            if (swai_error.codigo === SwaiErrorCode.RECURSO_NO_ENCONTRADO) {
              this.datos_de_empleo.controls.plantel_de_dependencia.setErrors({
                plantel_no_existe: true,
              });
            }
          }
          this.plantel = null;
        } finally {
          this.loadings.plantel = false;
        }
      });

    this.centro_de_votacion.controls.parroquia.valueChanges.subscribe(
      async (parroquia) => {
        this.centro_de_votacion.controls.centro.setValue(null);
        if (parroquia === null) return;

        this.loadings.centros_de_votacion = true;
        try {
          this.centros_de_votacion =
            await this.api.client.venezuela.obtener_centros_de_votacion.query({
              por_parroquia: parroquia,
            });
        } finally {
          this.loadings.centros_de_votacion = false;
        }
      }
    );

    this.datos_de_empleo.controls.tipo_de_empleado.valueChanges.subscribe(
      (tipo) => {
        if (tipo === null) return;

        const es_obrero = +tipo === TIPO_DE_EMPLEADO.OBRERO;
        const es_docente = +tipo === TIPO_DE_EMPLEADO.DOCENTE;

        console.log('cambio', tipo, es_obrero);

        if (!es_docente) {
          this.datos_de_empleo.controls.docente_guia.setValue(false);
        }

        this.datos_de_empleo.controls.titulo_de_pregrado.setValidators([
          validateIf(!es_obrero, Validators.required),
        ]);

        this.datos_de_empleo.controls.especialidad.setValidators([
          validateIf(es_docente, Validators.required),
        ]);
        this.datos_de_empleo.controls.plantel_de_dependencia.setValidators([
          validateIf(es_docente, Validators.required),
        ]);

        this.datos_de_empleo.controls.plantel_de_dependencia.updateValueAndValidity();
        this.datos_de_empleo.controls.especialidad.updateValueAndValidity();
        this.datos_de_empleo.controls.titulo_de_pregrado.updateValueAndValidity();
      }
    );

    this.datos_de_salud.controls.discapacidad.valueChanges.subscribe(
      (posee_discapacidad) => {
        this.datos_de_salud.controls.tipo_de_discapacidad.setValidators([
          validateIf(!!posee_discapacidad, Validators.required),
        ]);
        this.datos_de_salud.controls.tipo_de_discapacidad.updateValueAndValidity();
      }
    );

    this.route.data.subscribe((data) => {
      const modo: 'registrar' | 'editar' | undefined = data['inputs']?.modo;
      const empleado: EmpleadoDTO | undefined =
        data['inputs']?.empleado ?? data['empleado'];

      if (modo && modo !== 'registrar' && modo !== 'editar')
        throw new Error(
          'Debe asignar un `modo` para este componente: "registrar" | "editar"'
        );

      if (modo === 'editar' && !empleado)
        throw new Error('Debe debe proporcionar `empleado` en `modo` editar');

      this.modo = modo!;
      this.empleado = empleado ?? null;

      this.init_modo(modo!);
    });
  }

  /* ................................ init modo ............................... */
  private init_modo(modo: 'registrar' | 'editar') {
    if (modo === 'editar') {
      const empleado = this.empleado!;

      this.datos_personales.setValue({
        nombres: empleado.nombres,
        apellidos: empleado.apellidos,
        cedula: empleado.cedula + '',
        fecha_de_nacimiento: empleado.fecha_de_nacimiento as any,
        sexo: empleado.sexo,
        estado_civil: empleado.estado_civil.id,
      });

      this.datos_personales.controls.cedula.disable();
      this.datos_personales.controls.fecha_de_nacimiento.disable();
      this.datos_personales.controls.sexo.disable();

      this.centro_de_votacion.controls.parroquia.setValue(
        empleado.centro_de_votacion.codigo_parroquia
      );
      this.centro_de_votacion.controls.centro.setValue(
        empleado.centro_de_votacion.codigo
      );

      this.datos_de_empleo.setValue({
        tipo_de_empleado: empleado.tipo_de_empleado.id,
        rif: empleado.rif,
        codigo_carnet_patria: empleado.codigo_carnet_patria,
        fecha_de_ingreso: empleado.fecha_de_ingreso as any,
        titulo_de_pregrado:
          (empleado as ProfesorDTO).titulo_de_pregrado?.id ?? null,
        especialidad: (empleado as ProfesorDTO).especialidad?.id ?? null,
        plantel_de_dependencia:
          (empleado as ProfesorDTO).plantel_de_dependencia?.dea ?? null,
        docente_guia: !!(empleado as ProfesorDTO).seccion_guia,
        docente_guia_nivel_academico: (empleado as ProfesorDTO).seccion_guia?.nivel_academico || null,
        docente_guia_seccion: (empleado as ProfesorDTO).seccion_guia?.seccion || null
      });

      this.datos_de_contacto.setValue({
        telefono: empleado.telefono,
        email: empleado.correo,
        direccion: empleado.direccion ?? null,
      });

      this.datos_de_salud.setValue({
        tipo_de_sangre: empleado.tipo_de_sangre.id,
        discapacidad: !!empleado.discapacidad,
        tipo_de_discapacidad:
          empleado.discapacidad?.tipo_de_discapacidad.id ?? null,
        descripcion_discapacidad: empleado.discapacidad?.descripcion ?? null,
      });
    }
  }

  protected enviar_datos() {
    if (this.modo === 'registrar') {
      this.registrar();
    } else {
      this.editar();
    }
  }

  /* ................................ registrar ............................... */
  private async registrar() {
    this.loadings.enviando = true;

        const nivel_academico = this.datos_de_empleo.controls.docente_guia_nivel_academico.value;
    const seccion = this.datos_de_empleo.controls.docente_guia_seccion.value;
    const es_docente_guia = this.datos_de_empleo.controls.docente_guia.value;

    const seccion_guia = (es_docente_guia ? `${nivel_academico}${seccion}` : null ) as `${number}${string}` | null


    try {
      const empleado =
        await this.api.client.empleados.registrar_empleado.mutate({
          tipo: +this.datos_de_empleo.controls.tipo_de_empleado.value!,
          datos: {
            cedula: +this.datos_personales.controls.cedula.value!,
            nombres: this.datos_personales.controls.nombres.value!,
            apellidos: this.datos_personales.controls.apellidos.value!,
            estado_civil: +this.datos_personales.controls.estado_civil.value!,
            correo: this.datos_de_contacto.controls.email.value!,
            sexo: this.datos_personales.controls.sexo.value!,
            fecha_de_nacimiento: parse(
              date(),
              this.datos_personales.controls.fecha_de_nacimiento.value
            ),
            tipo_de_sangre: +this.datos_de_salud.controls.tipo_de_sangre.value!,
            telefono: this.datos_de_contacto.controls.telefono.value!,
            rif: this.datos_de_empleo.controls.rif.value!,
            codigo_carnet_patria:
              this.datos_de_empleo.controls.codigo_carnet_patria.value!,
            especialidad: this.datos_de_empleo.controls.especialidad.value!,
            plantel_de_dependencia:
              this.datos_de_empleo.controls.plantel_de_dependencia.value!,
            centro_de_votacion: this.centro_de_votacion.controls.centro.value!,
            titulo_de_pregrado:
              +this.datos_de_empleo.controls.titulo_de_pregrado.value!,
            fecha_de_ingreso: parse(
              date(),
              this.datos_de_empleo.controls.fecha_de_ingreso.value
            ),
            seccion_guia,
          },
        });

      this.toast.add({
        summary: 'Empleado ha sido registrado con exito',
        severity: 'success',
      });
    } finally {
      this.loadings.enviando = false;
    }
  }

  /* ................................. editar ................................. */
  private editar() {
    // TODO: Implementar editar empleado

    this.loadings.enviando = true;

    const nivel_academico = this.datos_de_empleo.controls.docente_guia_nivel_academico.value;
    const seccion = this.datos_de_empleo.controls.docente_guia_seccion.value;
    const es_docente_guia = this.datos_de_empleo.controls.docente_guia.value;

    const seccion_guia = (es_docente_guia ? `${nivel_academico}${seccion}` : null ) as `${number}${string}` | null

    try {
      this.api.client.empleados.actualizar_empelado.mutate({
        cedula: +this.datos_personales.controls.cedula.value!,
        datos: {
          nombres: this.datos_personales.controls.nombres.value! || undefined,
          apellidos:
            this.datos_personales.controls.apellidos.value! || undefined,
          estado_civil:
            +this.datos_personales.controls.estado_civil.value! || undefined,
          correo: this.datos_de_contacto.controls.email.value! || undefined,
          tipo_de_sangre:
            +this.datos_de_salud.controls.tipo_de_sangre.value! || undefined,
            direccion: this.datos_de_contacto.controls.direccion.value! || undefined,
          telefono:
            this.datos_de_contacto.controls.telefono.value! || undefined,
          rif: this.datos_de_empleo.controls.rif.value! || undefined,
          codigo_carnet_patria:
            this.datos_de_empleo.controls.codigo_carnet_patria.value! ||
            undefined,
          especialidad:
            this.datos_de_empleo.controls.especialidad.value! || undefined,
          plantel_de_dependencia:
            this.datos_de_empleo.controls.plantel_de_dependencia.value! ||
            undefined,
          centro_de_votacion:
            this.centro_de_votacion.controls.centro.value! || undefined,
          titulo_de_pregrado:
            +this.datos_de_empleo.controls.titulo_de_pregrado.value! ||
            undefined,
          fecha_de_ingreso: parse(
            date(),
            this.datos_de_empleo.controls.fecha_de_ingreso.value
          ),
          discapacidad: this.datos_de_salud.controls.discapacidad.value
            ? {
                tipo_de_discapacidad:
                  this.datos_de_salud.controls.tipo_de_discapacidad.value!,
                descripcion:
                  this.datos_de_salud.controls.descripcion_discapacidad.value,
              }
            : null,
          seccion_guia,
        },
      });
      
      this.toast.add({
        summary: 'Empleado ha sido actualizado con exito',
        severity: 'success',
      });

      this.router.navigateByUrl(`/admin/empleados`, { skipLocationChange: true }).then(() => {
        this.router.navigate([`/admin/empleados/${this.empleado!.cedula}`]);
      });

    } finally {
      this.loadings.enviando = false;
    }
  }
}
