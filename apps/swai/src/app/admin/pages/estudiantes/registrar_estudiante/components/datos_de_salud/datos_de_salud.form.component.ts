import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TIPOS_DE_DISCAPACIDAD, TIPOS_DE_SANGRE } from '@swai/core';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { validateIf } from '../../../../../../common/utils/angular/forms/validateif';


@Component({
  selector: 'aw-form-datos-de-salud',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    SelectButtonModule,
  ],
  templateUrl: './datos_de_salud.form.component.html',
  styleUrl: './datos_de_salud.form.component.sass',
})
export class DatosDeSaludFormComponent implements OnInit {
  /* ................................ constants ............................... */

  protected TIPOS_DE_SANGRE = TIPOS_DE_SANGRE;
  protected TIPOS_DE_DISCAPACIDAD = TIPOS_DE_DISCAPACIDAD

  /* .................................. state ................................. */

  protected datos_de_salud = new FormGroup({
    tipo_de_sangre: new FormControl<number | null>(null, [Validators.required]),
    discapacidad: new FormControl<boolean>(false),
    tipo_de_discapacidad: new FormControl<number | null>(null),
    descripcion_discapacidad: new FormControl<string | null>(null),
  });


  /* .............................. ciclo de vida ............................. */

  ngOnInit(): void {
    
    this.datos_de_salud.controls.discapacidad.valueChanges.subscribe(
      (posee_discapacidad) => {
        this.datos_de_salud.controls.tipo_de_discapacidad.setValidators([
          validateIf(!!posee_discapacidad, Validators.required),
        ]);
        this.datos_de_salud.controls.tipo_de_discapacidad.updateValueAndValidity();
      }
    );
  }

  /* ................................. getters ................................ */

  get form() {
    return this.datos_de_salud;
  }

}
