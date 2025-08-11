import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { safeParse } from 'valibot';
import { UsuarioSchema } from '@swai/core';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'aw-cambiar-clave.page.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    CardModule,
  ],
  templateUrl: './cambiar_clave.page.component.html',
  styleUrl: './cambiar_clave.page.component.css',
})
export class CambiarClavePageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private toast = inject(MessageService);

  protected cambiar_clave_form = new FormGroup({
    clave: new FormControl('', [Validators.required, this.validar_clave]),
    confirmar_clave: new FormControl('', [Validators.required]),
  });

  protected verificando_informacion = true;

  protected loadings = { cambiando_clave: false };

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.router.navigate(['/']);
      return;
    }

    this.api.client.auth.validar_token
      .query(token)
      .then((response) => {
        this.verificando_informacion = false;
        console.log(response);
      })
      .catch(() => {
        this.router.navigate(['/']);
      });

    this.cambiar_clave_form.controls.confirmar_clave.valueChanges.subscribe(
      (value) => {
        const same = value === this.cambiar_clave_form.value.clave!;

        if (!same) {
          this.cambiar_clave_form.controls.confirmar_clave.setErrors({
            invalid: 'Las contraseñas deben coincidir',
          });
        } else {
          this.cambiar_clave_form.controls.confirmar_clave.setErrors(null);
        }
      },
    );
  }

  cambiar_clave() {
    this.loadings.cambiando_clave = true;

    this.api.client.usuarios.restablecer_clave
      .mutate({
        token: this.route.snapshot.queryParamMap.get('token')!,
        nueva_clave: this.cambiar_clave_form.value.clave!,
        confirmar_nueva_clave: this.cambiar_clave_form.value.confirmar_clave!,
      })
      .then(() => {
        this.toast.add({
          severity: 'success',
          summary: 'Contraseña restablecida',
          detail: 'La contraseña a se ha restablecido correctamente',
        });
        this.router.navigate(['/login']);
      })
      .finally(() => {
        this.loadings.cambiando_clave = false;
      });
  }

  private validar_clave(control: AbstractControl) {
    const validation = safeParse(UsuarioSchema.entries.clave, control.value);
    if (validation.success) return null;
    return {
      invalid: validation.issues[0].message,
    };
  }
}
