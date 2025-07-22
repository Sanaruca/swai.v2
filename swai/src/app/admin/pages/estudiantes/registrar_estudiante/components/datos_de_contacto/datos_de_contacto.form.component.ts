import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'aw-form-datos-de-contacto',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputMaskModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './datos_de_contacto.form.component.html',
  styleUrl: './datos_de_contacto.form.component.css',
})
export class DatosDeContactoFormComponent {
  /* .................................. state ................................. */

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

  /* ................................. getters ................................ */
  get form() {
    return this.datos_de_contacto;
  }
}
