import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'aw-form-datos-antropometricos',
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule],
  templateUrl: './datos_antropometricos.form.component.html',
  styleUrl: './datos_antropometricos.form.component.sass',
})
export class DatosAntropometricosFormComponent {

  /* .................................. state ................................. */

    protected datos_antropometricos = new FormGroup({
    peso: new FormControl<string | null>(null),
    estatura: new FormControl<string | null>(null),
    chemise: new FormControl<string | null>(null),
    pantalon: new FormControl<string | null>(null),
  });

  /* ................................. getters ................................ */

  get form() {
    return this.datos_antropometricos;
  }

}
