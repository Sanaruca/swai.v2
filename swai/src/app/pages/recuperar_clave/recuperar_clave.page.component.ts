import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'aw-recuperar-clave.page.component',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    CardModule,
    ToastModule,
  ],
  templateUrl: './recuperar_clave.page.component.html',
  styleUrl: './recuperar_clave.page.component.css',
})
export class RecuperarClavePageComponent {
  private api = inject(ApiService);
  private toast = inject(MessageService);

  protected recuperar_clave_form = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
  });

  protected loadings = { enviando: false };

  protected success = false;

  enviar_formulario() {
    if (this.recuperar_clave_form.invalid) return;

    this.loadings.enviando = true;

    this.api.client.usuarios.recuperar_clave
      .mutate({ correo: this.recuperar_clave_form.value.correo! })
      .then(() => {
        this.success = true;
        this.recuperar_clave_form.reset();
        this.toast.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Se ha enviado un correo electronico a su cuenta',
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => (this.loadings.enviando = false));
  }
}
