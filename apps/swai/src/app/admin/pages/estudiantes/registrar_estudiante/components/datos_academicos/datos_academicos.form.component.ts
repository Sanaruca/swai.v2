import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectModule } from 'primeng/select';
import {
  EstadoAcademicoTagComponent,
  SeccionTagComponent,
  TipoDeEstudianteTagComponent,
} from '../../../../../../common/components';
import {
  ESTADO_ACADEMICO,
  ESTADOS_ACADEMICOS,
  NIVELES_ACADEMICOS,
  Seccion,
  TIPO_DE_ESTUDIANTE,
  TIPOS_DE_ESTUDIANTE,
} from '@swai/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { NivelAcademicoConSeccionesDTO } from '@swai/server';
import { ActivatedRoute } from '@angular/router';
import { merge } from 'rxjs';
import { validateIf } from '../../../../../../common/utils/angular/forms/validateif';


@Component({
  selector: 'aw-form-datos-academicos',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    TipoDeEstudianteTagComponent,
    EstadoAcademicoTagComponent,
    SeccionTagComponent,
    SelectButtonModule,
    DatePickerModule,
  ],
  templateUrl: './datos_academicos.form.component.html',
  styleUrl: './datos_academicos.form.component.sass',
})
export class DatosAcademicosFormComponent implements OnInit {
  /* ............................... injectables .............................. */

  private route = inject(ActivatedRoute);

  /* ................................ constants ............................... */

  protected TIPOS_DE_ESTUDIANTE = TIPOS_DE_ESTUDIANTE;
  protected TIPO_DE_ESTUDIANTE = TIPO_DE_ESTUDIANTE;
  protected ESTADOS_ACADEMICOS = ESTADOS_ACADEMICOS;
  protected ESTADO_ACADEMICO = ESTADO_ACADEMICO;
  protected NIVELES_ACADEMICOS = NIVELES_ACADEMICOS;

  /* .................................. state ................................. */

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

  /* .................................. data .................................. */

  protected niveles_academicos: NivelAcademicoConSeccionesDTO[] =
    this.route.snapshot.data['niveles_academicos'];

  /* ................................. getters ................................ */

  protected get secciones(): Seccion[] {
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

  get form() {
    return this.datos_academicos;
  }



  /* .............................. ciclo de vida ............................. */

  ngOnInit(): void {

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
    
  }


}
