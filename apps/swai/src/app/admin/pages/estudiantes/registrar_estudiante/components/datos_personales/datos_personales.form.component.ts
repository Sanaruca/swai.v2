import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ESTADOS_FEDERALES, EstadosDeVenezuelaISO, Municipio, SEXO } from '@swai/core';
import { ApiService } from '../../../../../../services/api.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'aw-form-datos-personales',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    DatePickerModule,
    SelectModule,
    SelectButtonModule,
    InputTextModule
  ],
  templateUrl: './datos_personales.form.component.html',
  styleUrl: './datos_personales.form.component.sass',
})
export class DatosPersonalesFormComponent implements OnInit {
  /* ............................... injectables .............................. */

  private api = inject(ApiService);

  /* ............................... constantes ............................... */

  protected ESTADOS_FEDERALES = ESTADOS_FEDERALES

  /* .................................. state ................................. */

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

  protected municipios: Municipio[] = [];

  protected loadings = {
    municipios: false,
  };

  /* .............................. ciclo de vida ............................. */

  ngOnInit(): void {
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
  }

  /* ................................. getters ................................ */
  get form() {
    return this.datos_personales;
  }
}
