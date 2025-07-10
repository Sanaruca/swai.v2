import { Component, inject, Input, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  Discapacitado,
  ESTADO_ACADEMICO,
  ESTADOS_ACADEMICOS,
  ESTADOS_FEDERALES,
  EstudianteDTO,
  EstudianteSchema,
  Municipio,
  NivelAcademicoSchema,
  NIVELES_ACADEMICOS,
  PersonaSchema,
  TIPO_DE_ESTUDIANTE,
  TIPOS_DE_DISCAPACIDAD,
  TIPOS_DE_ESTUDIANTE,
  TIPOS_DE_SANGRE,
} from '@swai/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { TextareaModule } from 'primeng/textarea';
import { parse, ValiError } from 'valibot';
import { MessageService } from 'primeng/api';
import { DatosPersonalesFormComponent } from './components/datos_personales/datos_personales.form.component';
import { DatosDeSaludFormComponent } from './components/datos_de_salud/datos_de_salud.form.component';
import { DatosDeContactoFormComponent } from './components/datos_de_contacto/datos_de_contacto.form.component';
import { DatosAcademicosFormComponent } from './components/datos_academicos/datos_academicos.form.component';
import { DatosAntropometricosFormComponent } from './components/datos_antropometricos/datos_antropometricos.form.component';

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
    TextareaModule,
    DatosPersonalesFormComponent,
    DatosDeContactoFormComponent,
    DatosAcademicosFormComponent,
    DatosDeSaludFormComponent,
    DatosAntropometricosFormComponent,
  ],
  templateUrl: './registrar_estudiante.page.component.html',
  styleUrl: './registrar_estudiante.page.component.scss',
})
export class RegistrarEstudiantePageComponent implements OnInit {
  /* ............................... injectables .............................. */

  private api = inject(ApiService);
  private toast = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /* ................................ contantes ............................... */
  protected INSTITUTION_NAME = 'environment.INSTITUTION_NAME';

  /* ................................. inputs ................................. */
  @Input() modo!: 'registrar' | 'editar';
  @Input() estudiante: EstudianteDTO | null = null;

  /* ................................. estado ................................. */

  protected municipios: Municipio[] = [];

  protected loadings = {
    municipios: false,
    enviando_datos: false,
  };

  get puede_enviar_formulario(): boolean {
    return (
      this.datos_personales_component().form.valid &&
      this.datos_academicos_component().form.valid &&
      this.datos_antropometricos_component().form.valid &&
      this.datos_de_contacto_component().form.valid &&
      this.datos_de_salud_component().form.valid
    );
  }

  // TODO: Sospecho que el scrollbar de ngprime esta provocando que se ejecute el detector un numero incecesaro de veces

  protected paso_actual = 1;

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

  /* ............................... components ............................... */

  protected datos_personales_component = viewChild.required(
    DatosPersonalesFormComponent
  );

  protected datos_de_contacto_component = viewChild.required(
    DatosDeContactoFormComponent
  );

  protected datos_academicos_component = viewChild.required(
    DatosAcademicosFormComponent
  );

  protected datos_de_salud_component = viewChild.required(
    DatosDeSaludFormComponent
  );

  protected datos_antropometricos_component = viewChild.required(
    DatosAntropometricosFormComponent
  );

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

      const nivel_academico = Number(this.route.snapshot.queryParamMap.get('nivel_academico'))

      if (modo === 'registrar' && nivel_academico){

        try {
          parse(NivelAcademicoSchema.entries.numero, nivel_academico)
        } catch {
          return
        }

        this.datos_academicos_component().form.controls.nivel_academico.setValue(nivel_academico)

      }
    });
  }

  /* ................................. metodos ................................ */

  private init_modo(modo: 'editar' | 'registrar') {
    if (modo === 'editar') {
      const estudiante = this.estudiante!;

      this.municipios = [estudiante.municipio_de_nacimiento as any];

      this.datos_personales_component().form.setValue({
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        cedula: estudiante.cedula + '',
        fecha_de_nacimiento: estudiante.fecha_de_nacimiento as any,
        estado_federal:
          estudiante.municipio_de_nacimiento.estado_federal.codigo,
        municipio_federal: estudiante.municipio_de_nacimiento.codigo,
        sexo: estudiante.sexo,
      });

      this.datos_personales_component().form.controls.cedula.disable();
      this.datos_personales_component().form.controls.estado_federal.disable();
      this.datos_personales_component().form.controls.municipio_federal.disable();
      this.datos_personales_component().form.controls.fecha_de_nacimiento.disable();
      this.datos_personales_component().form.controls.sexo.disable();

      this.datos_de_contacto_component().form.setValue({
        telefono: estudiante.telefono,
        email: estudiante.correo,
        direccion: estudiante.direccion ?? null,
      });

      const posee_materias_pendientes =
        !!estudiante.materias_pendientes?.length;

      this.datos_academicos_component().form.setValue({
        tipo_de_estudiante: estudiante.tipo.id!,
        estado_academico: estudiante.estado_academico.id,
        nivel_academico: estudiante.nivel_academico.numero,
        seccion: estudiante.seccion?.seccion ?? null,
        fecha_de_inscripcion: estudiante.fecha_de_inscripcion as any,
        fecha_de_egreso: estudiante.fecha_de_egreso as any,
        posee_materias_pendientes,
        materias_pendientes: posee_materias_pendientes
          ? estudiante.materias_pendientes?.map((mp) => mp.codigo) ?? []
          : null,
      });

      this.datos_de_salud_component().form.setValue({
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

    const discapacidad: Omit<Discapacitado, 'cedula'> | null =
      this.datos_de_salud_component().form.controls.discapacidad.value
        ? {
            descripcion:
              this.datos_de_salud_component().form.controls
                .descripcion_discapacidad.value,
            tipo_de_discapacidad:
              this.datos_de_salud_component().form.controls.tipo_de_discapacidad
                .value!,
          }
        : null;

    try {
      await this.api.client.estudiantes.actualizar_estudiante.mutate({
        estudiante: this.estudiante!.cedula,
        actualizacion: {
          seccion: this.datos_academicos_component().form.controls.seccion
            .value as any,
          direccion:
            this.datos_de_contacto_component().form.controls.direccion.value!,
          nivel_academico:
            +this.datos_academicos_component().form.controls.nivel_academico
              .value!,
          tipo: +this.datos_academicos_component().form.controls
            .tipo_de_estudiante.value!,
          correo: this.datos_de_contacto_component().form.controls.email.value!,
          tipo_de_sangre:
            +this.datos_de_salud_component().form.controls.tipo_de_sangre
              .value!,
          nombres:
            this.datos_personales_component().form.controls.nombres.value!,
          apellidos:
            this.datos_personales_component().form.controls.apellidos.value!,
          discapacidad,
          telefono:
            this.datos_de_contacto_component().form.controls.telefono.value!,
          fecha_de_egreso:
            parse(
              EstudianteSchema.entries.fecha_de_egreso,
              this.datos_academicos_component().form.controls.fecha_de_egreso
                .value
            ) ?? null,
          fecha_de_inscripcion: parse(
            EstudianteSchema.entries.fecha_de_inscripcion,
            this.datos_academicos_component().form.controls.fecha_de_inscripcion
              .value
          ),
          estado_academico:
            +this.datos_academicos_component().form.controls.estado_academico
              .value!,
          materias_pendientes:
            this.datos_academicos_component().form.controls.materias_pendientes
              .value,
        },
      });

      this.toast.add({
        summary: 'Estudiante ha sido actualizado con exito con exito',
        severity: 'success',
      });

        this.router.navigate([`/admin/estudiantes/${this.estudiante!.cedula}`], {state: {actualizado: true}});
    } finally {
      this.loadings.enviando_datos = false;
    }
  }

  /* ................................ registrar ............................... */
  private async registrar() {
    this.loadings.enviando_datos = true;

    const discapacidad: Omit<Discapacitado, 'cedula'> | null =
      this.datos_de_salud_component().form.controls.discapacidad.value
        ? {
            descripcion:
              this.datos_de_salud_component().form.controls
                .descripcion_discapacidad.value,
            tipo_de_discapacidad:
              this.datos_de_salud_component().form.controls.tipo_de_discapacidad
                .value!,
          }
        : null;

    try {
      const estudiante =
        await this.api.client.estudiantes.registrar_estudiante.mutate({
          direccion:
            this.datos_de_contacto_component().form.controls.direccion.value!,
          nivel_academico:
            +this.datos_academicos_component().form.controls.nivel_academico
              .value!,
          tipo: +this.datos_academicos_component().form.controls
            .tipo_de_estudiante.value!,
          sexo: this.datos_personales_component().form.controls.sexo.value!,
          correo: this.datos_de_contacto_component().form.controls.email.value!,
          tipo_de_sangre:
            +this.datos_de_salud_component().form.controls.tipo_de_sangre
              .value!,
          cedula:
            +this.datos_personales_component().form.controls.cedula.value!,
          nombres:
            this.datos_personales_component().form.controls.nombres.value!,
          apellidos:
            this.datos_personales_component().form.controls.apellidos.value!,
          discapacidad,
          fecha_de_nacimiento: parse(
            PersonaSchema.entries.fecha_de_nacimiento,
            this.datos_personales_component().form.controls.fecha_de_nacimiento
              .value
          ),
          telefono:
            this.datos_de_contacto_component().form.controls.telefono.value!,
          fecha_de_egreso:
            parse(
              EstudianteSchema.entries.fecha_de_egreso,
              this.datos_academicos_component().form.controls.fecha_de_egreso
                .value
            ) ?? null,
          fecha_de_inscripcion: parse(
            EstudianteSchema.entries.fecha_de_inscripcion,
            this.datos_academicos_component().form.controls.fecha_de_inscripcion
              .value
          ),
          municipio_de_nacimiento:
            this.datos_personales_component().form.controls.municipio_federal
              .value!,
          estado_academico:
            +this.datos_academicos_component().form.controls.estado_academico
              .value!,
          materias_pendientes:
            this.datos_academicos_component().form.controls.materias_pendientes
              .value,
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

  /* ................................. getters ................................ */

  get formulario_actual(): FormGroup | void {
    switch (this.paso_actual) {
      case 1:
        return this.datos_personales_component().form;
      case 2:
        return this.datos_de_contacto_component().form;
      case 3:
        return this.datos_academicos_component().form;
      case 4:
        return this.datos_de_salud_component().form;
      case 5:
        return this.datos_antropometricos_component().form;
      default:
        break;
    }
  }
}
