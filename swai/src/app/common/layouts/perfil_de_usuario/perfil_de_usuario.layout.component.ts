import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InfoCardComponent } from '../../../admin/components/info_card/info_card.component';
import { Avatar } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from 'swai/src/app/services/auth.service';
import { NombrePipe } from '../../pipes/nombre.pipe';
import { ApiService } from 'swai/src/app/services/api.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { UsuarioDTO } from '@swai/core';

// TODO: puede ser optimizado

@Component({
  selector: 'aw-perfil-de-usuario.layout.component',
  imports: [
    CommonModule,
    ButtonModule,
    InfoCardComponent,
    Avatar,
    TagModule,
    InputTextModule,
    TextareaModule,
    NombrePipe,
    ReactiveFormsModule,
    SelectButtonModule,
  ],
  templateUrl: './perfil_de_usuario.layout.component.html',
  styleUrl: './perfil_de_usuario.layout.component.css',
})
export class PerfilDeUsuarioLayoutComponent implements OnInit {
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private toast = inject(MessageService);

  protected usuario = this.auth.snapshot.usuario!;
  protected loadings = {
    actualizar_usuario: false,
    cambiar_clave: false,
  };

  public esta_editando = false;

  protected usuario_form = new FormGroup({
    nombres: new FormControl(this.usuario.nombres),
    nombre_de_usuario: new FormControl(this.usuario.nombre_de_usuario),
    apellidos: new FormControl(this.usuario.apellidos),
    correo: new FormControl(this.usuario.correo),
    telefono: new FormControl(this.usuario.telefono),
    direccion: new FormControl(this.usuario.direccion),
    sexo: new FormControl(this.usuario.sexo),
  });

  protected cambio_de_clave_form = new FormGroup({
    clave: new FormControl(''),
    nueva_clave: new FormControl(''),
    confirmar_nueva_clave: new FormControl(''),
  });

  protected usuario_modificado = false;

  ngOnInit(): void {
    this.usuario_form.controls.sexo.disable();

    this.toggle_editar(false);

    this.usuario_form.valueChanges.subscribe((changes) => {
      const algun_dato_modificado = Object.entries(changes).some(
        ([key, value]) => this.usuario[key as keyof UsuarioDTO] !== value,
      );
      this.usuario_modificado = algun_dato_modificado;
    });
  }

  protected cambiar_clave() {
    const cambio_de_clave = this.cambio_de_clave_form.value;
    if (this.cambio_de_clave_form.invalid) return;
    this.loadings.cambiar_clave = true;
    this.api.client.auth.cambiar_clave
      .mutate({
        clave: cambio_de_clave.clave!,
        nueva_clave: cambio_de_clave.nueva_clave!,
        confirmar_nueva_clave: cambio_de_clave.confirmar_nueva_clave!,
      })
      .then(() => {
        this.cambio_de_clave_form.reset();
        this.toast.add({
          severity: 'success',
          summary: 'Contraseña a cambiada',
          detail: 'La contraseña a se ha cambiado correctamente',
        });
      })
      .finally(() => {
        this.loadings.cambiar_clave = false;
      });
  }

  toggle_editar(value: boolean | undefined = undefined) {
    if (value === undefined) {
      this.esta_editando = !this.esta_editando;
    } else {
      this.esta_editando = value;
    }

    this.init_usuario_form();

    if (this.esta_editando) {
      this.usuario_form.controls.nombres.enable();
      this.usuario_form.controls.nombre_de_usuario.enable();
      this.usuario_form.controls.apellidos.enable();
      this.usuario_form.controls.correo.enable();
      this.usuario_form.controls.telefono.enable();
      this.usuario_form.controls.direccion.enable();
    } else {
      this.usuario_form.controls.nombres.disable();
      this.usuario_form.controls.nombre_de_usuario.disable();
      this.usuario_form.controls.apellidos.disable();
      this.usuario_form.controls.correo.disable();
      this.usuario_form.controls.telefono.disable();
      this.usuario_form.controls.direccion.disable();
    }
  }

  actualizar_usuario() {
    this.loadings.actualizar_usuario = true;
    this.api.client.auth.actualizar_usuario
      .mutate({
        refresh_token: true,
        cedula: this.usuario.cedula,
        actualizacion: this.usuario_form.value,
      } as any)
      // @ts-expect-error
      .then((response: { token: string; data: UsuarioDTO }) => {
        this.auth.setUsuario(response.data);
        this.usuario = response.data;
        this.init_usuario_form();
        this.toggle_editar(false);
        this.toast.add({
          severity: 'success',
          summary: 'Usuario actualizado',
          detail: 'El usuario se ha actualizado correctamente',
        });
      })
      .finally(() => {
        this.loadings.actualizar_usuario = false;
      });
  }

  private init_usuario_form() {
    this.usuario_form.reset(
      {
        nombres: this.usuario.nombres,
        nombre_de_usuario: this.usuario.nombre_de_usuario,
        apellidos: this.usuario.apellidos,
        correo: this.usuario.correo,
        telefono: this.usuario.telefono,
        direccion: this.usuario.direccion,
        sexo: this.usuario.sexo,
      },
      { emitEvent: false },
    );
  }
}
