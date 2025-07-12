import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InstitucionDTO } from '@swai/core';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { InputMaskModule } from 'primeng/inputmask';
import { ApiService } from '../../../services/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'aw-configuracion.page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DividerModule,
    CardModule,
    TableModule,
    DialogModule,
    SelectModule,
    InputNumberModule,
    ToastModule,
    TooltipModule,
    SkeletonModule,
    CheckboxModule,
    DatePickerModule,
    TextareaModule,
    InputMaskModule,
  ],
  templateUrl: './configuracion.page.component.html',
  styleUrl: './configuracion.page.component.sass',
})
export class ConfiguracionPageComponent {

  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private toast = inject(MessageService);

  protected get periodo_academico_actual_placeholder(): string {
    const hoy = new Date();
    const anio_actual = hoy.getFullYear();
    const anio_siguiente = anio_actual + 1;
    return `${anio_actual}-${anio_siguiente}`;
  }

  protected hasChanges = false;

  protected getHasChanges() {
    const institucion = {...this.institucion, municipio: this.institucion.municipio.nombre};
    const form = Object.keys(institucion).reduce((acc, key) => {
      acc[key] = this.form.get(key)?.value;
      return acc;
    }, {} as any);
    
    return !Object.entries(institucion).every(([key, value]) => {
      return value === form[key];
    });
    
  }

  protected loadings = {
    enviando_datos: false,
  };


  protected institucion = this.route.snapshot.data[
    'institucion'
  ] as InstitucionDTO;

  form = new FormGroup({
    codigo: new FormControl(this.institucion.codigo),
    nombre: new FormControl(this.institucion.nombre),
    rif: new FormControl(this.institucion.rif),
    direccion: new FormControl(this.institucion.direccion),
    telefono: new FormControl(this.institucion.telefono),
    correo: new FormControl(this.institucion.correo),
    fecha_de_fundacion: new FormControl(this.institucion.fecha_de_fundacion),
    ultima_actualizacion: new FormControl(
      this.institucion.ultima_actualizacion
    ),
    plantel_educativo: new FormControl(this.institucion.plantel_educativo.dea),
    municipio: new FormControl(this.institucion.municipio.nombre),
    periodo_academico_actual: new FormControl(
      this.institucion.periodo_academico_actual
    ),
    inicio_de_periodo_academico: new FormControl<Date>(
      this.institucion.inicio_de_periodo_academico
    ),
    fin_de_periodo_academico: new FormControl<Date>(
      this.institucion.fin_de_periodo_academico
    ),
    evaluar_periodo_academico: new FormControl(
      this.getPeriodoAcademiconActual(
        this.institucion.inicio_de_periodo_academico,
        this.institucion.fin_de_periodo_academico
      ) === this.institucion.periodo_academico_actual
    ),
  });

  ngOnInit(): void {
    this.form.get('plantel_educativo')?.disable();
    this.form.get('municipio')?.disable();

    this.form.valueChanges.subscribe(() => {
      this.hasChanges = this.getHasChanges();
    });

    this.form
      .get('inicio_de_periodo_academico')
      ?.valueChanges.subscribe((inicio) => {
        const fin = this.form.get('fin_de_periodo_academico')?.value;
        if (
          this.form.get('evaluar_periodo_academico')?.value &&
          inicio &&
          fin
        ) {
          this.form
            .get('periodo_academico_actual')
            ?.setValue(this.getPeriodoAcademiconActual(inicio, fin));
        }
      });

    this.form.get('fin_de_periodo_academico')?.valueChanges.subscribe((fin) => {
      const inicio = this.form.get('inicio_de_periodo_academico')?.value;
      if (this.form.get('evaluar_periodo_academico')?.value && inicio && fin) {
        this.form
          .get('periodo_academico_actual')
          ?.setValue(this.getPeriodoAcademiconActual(inicio, fin));
      }
    });

    this.form
      .get('evaluar_periodo_academico')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          if (
            this.form.get('inicio_de_periodo_academico')?.value &&
            this.form.get('fin_de_periodo_academico')?.value
          ) {
            this.form
              .get('periodo_academico_actual')
              ?.setValue(
                this.getPeriodoAcademiconActual(
                  this.form.get('inicio_de_periodo_academico')?.value!,
                  this.form.get('fin_de_periodo_academico')?.value!
                )
              );
            this.form.get('periodo_academico_actual')?.disable();
          }
          return;
        }
        this.form.get('periodo_academico_actual')?.enable();
      });
  }

  protected cancelar() {
    this.form.reset({
      codigo: this.institucion.codigo,
      nombre: this.institucion.nombre,
      rif: this.institucion.rif,
      direccion: this.institucion.direccion,
      telefono: this.institucion.telefono,
      correo: this.institucion.correo,
      fecha_de_fundacion: this.institucion.fecha_de_fundacion,
      ultima_actualizacion: this.institucion.ultima_actualizacion,
      plantel_educativo: this.institucion.plantel_educativo.dea,
      municipio: this.institucion.municipio.nombre,
      periodo_academico_actual: this.institucion.periodo_academico_actual,
      inicio_de_periodo_academico: this.institucion.inicio_de_periodo_academico,
      fin_de_periodo_academico: this.institucion.fin_de_periodo_academico,
      evaluar_periodo_academico:
        this.getPeriodoAcademiconActual(
          this.institucion.inicio_de_periodo_academico,
          this.institucion.fin_de_periodo_academico
        ) === this.institucion.periodo_academico_actual,
    });
    

    this.hasChanges = false;
  }

  getPeriodoAcademiconActual(inicio: Date, fin: Date) {
    const inicio_anio = inicio.getFullYear();
    const fin_anio = fin.getFullYear();
    return `${inicio_anio}-${fin_anio}`;
  }


  protected guardar() {
    this.loadings.enviando_datos = true;
    this.api.client.institucion.actualizar_datos_institucionales.mutate({
      actualizacion: {
        nombre: this.form.get('nombre')?.value!,
        rif: this.form.get('rif')?.value!,
        direccion: this.form.get('direccion')?.value!,
        telefono: this.form.get('telefono')?.value!,
        correo: this.form.get('correo')?.value!,
        periodo_academico_actual: this.form.get('periodo_academico_actual')?.value!,
        inicio_de_periodo_academico: this.form.get('inicio_de_periodo_academico')?.value!,
        fin_de_periodo_academico: this.form.get('fin_de_periodo_academico')?.value!,
        fecha_de_fundacion: this.form.get('fecha_de_fundacion')?.value!,
      },
    })
    .then((institucion) => {
      this.institucion = institucion;
      this.toast.add({
        severity: 'success',
        summary: 'Datos han sido actualizados exitosamente',
        detail: 'Datos de la institución actualizados correctamente',
      });
      this.cancelar();
    })
    .finally(() => {
      this.loadings.enviando_datos = false;
    });
  }
}
