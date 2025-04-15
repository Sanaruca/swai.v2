import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CentroDeVotacion,
  ESPECIALIDADES,
  ESTADOS_CIVILES,
  ESTADOS_FEDERALES,
  EstadosDeVenezuelaISO,
  ISwaiError,
  Municipio,
  Parroquia,
  PlantelEducativo,
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
import { TipoDeEmpleadoTagComponent } from '../../../../common/components';
import { validateIf } from '../../../../common/utils/angular/forms/validateif';
import { ActivatedRoute } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { ApiService } from '../../../../services/api.service';
import { date, parse } from 'valibot';
import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { debounceTime } from 'rxjs';
import { TRPCClientError } from '@trpc/client';

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
  ],
  templateUrl: './registrar_empleado.page.component.html',
  styleUrl: './registrar_empleado.page.component.scss',
})
export class RegistrarEmpleadoPageComponent implements OnInit {
  /* ............................... constantes ............................... */

  protected ESPECIALIDADES = ESPECIALIDADES;
  protected TIPO_DE_EMPLEADO = TIPO_DE_EMPLEADO;
  protected TIPOS_DE_EMPLEADO = TIPOS_DE_EMPLEADO;
  protected ESTADOS_FEDERALES = ESTADOS_FEDERALES;
  protected TIPOS_DE_DISCAPACIDAD = TIPOS_DE_DISCAPACIDAD;
  protected TIPOS_DE_SANGRE = TIPOS_DE_SANGRE;
  protected ESTADOS_CIVILES = ESTADOS_CIVILES;

  /* ............................... injectables .............................. */

  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private toast = inject(MessageService);

  /* .............................. data inicial .............................. */

  protected titulos_de_pregrado = this.route.snapshot.data[
    'titulos_de_pregrado'
  ] as TituloPregrado[];

  protected municipios = this.route.snapshot.data['municipios'] as Municipio[];

  protected parroquias = this.route.snapshot.data['parroquias'] as Parroquia[];

  protected centros_de_votacion = [] as CentroDeVotacion[];

  /* .................................. state ................................. */

  protected paso_actual = 1;

  protected plantel: PlantelEducativo | null = null;

  protected loadings = {
    registrando: false,
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

  /* ............................ Datos personales ............................ */

  protected datos_personales = new FormGroup({
    nombres: new FormControl('', { validators: [Validators.required] }),
    apellidos: new FormControl('', { validators: [Validators.required] }),
    estado_civil: new FormControl<string | null>(null, {
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
    tipo_de_empleado: new FormControl<null | string>(null, {
      validators: [Validators.required],
    }),
    fecha_de_ingreso: new FormControl('', [Validators.required]),
    rif: new FormControl('', { validators: [Validators.required] }),
    codigo_carnet_patria: new FormControl('', {
      validators: [Validators.required],
    }),
    titulo_de_pregrado: new FormControl<string | null>(null),
    /* ................................. docente ................................ */
    especialidad: new FormControl<number | null>(null),
    plantel_de_dependencia: new FormControl<string | null>(null),
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
    tipo_de_sangre: new FormControl<string | null>(null, [Validators.required]),
    discapacidad: new FormControl<boolean>(false),
    tipo_de_discapacidad: new FormControl<string | null>(null),
    descripcion_discapacidad: new FormControl<string | null>(null),
  });
  /* ................................. on init ................................ */

  ngOnInit(): void {
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
  }

  protected async registrar() {
    this.loadings.registrando = true;
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
          },
        });

      this.toast.add({
        summary: 'Empleado ha sido registrado con exito',
        severity: 'success',
      });
    } finally {
      this.loadings.registrando = false;
    }
  }
}
