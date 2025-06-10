import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from '../../components';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  EspacioAcademicoDTO,
  Recurso,
  TIPO_DE_ESPACIO_ACADEMICO,
  TIPOS_DE_ESPACIO_ACADEMICO,
} from '@swai/core';
import { TableModule } from 'primeng/table';
import { IllustrationComponent } from '../../../common/components/illustration.component';
import { Paginated, CantidadDeEspaciosAcademicosDTO } from '@swai/server';
import { IconField } from 'primeng/iconfield';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputIcon } from 'primeng/inputicon';
import { recurso_primeicon_map } from '../../../common/utils';
import { TooltipModule } from 'primeng/tooltip';
import { TipoDeEspacioAcademicoTagComponent } from '../../../common/components';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ApiService } from '../../../services/api.service';
import { MenuItem, MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { EliminarEspacioAcaedemicoModalComponent } from './components';
import { environment } from '../../../../environments/environment';
import { SuccessEvent, UpsertEspacioAcademicoModalComponent } from './espacio_academico/components/upsert_espacio_academico/upsert_espacio_academico.modal.component';

@Component({
  selector: 'aw-espacios-acedemicos.page',
  imports: [
    CommonModule,
    InfoCardComponent,
    TableModule,
    IllustrationComponent,
    IconField,
    ReactiveFormsModule,
    InputIcon,
    TooltipModule,
    TipoDeEspacioAcademicoTagComponent,
    RouterLink,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TipoDeEspacioAcademicoTagComponent,
    InputNumberModule,
    CheckboxModule,
    MenuModule,
    EliminarEspacioAcaedemicoModalComponent,
    UpsertEspacioAcademicoModalComponent,
  ],
  templateUrl: './espacios_academicos.page.component.html',
  styleUrl: './espacios_academicos.page.component.scss',
})
export class EspaciosAcademicosPageComponent {
  /* ................................ contantes ............................... */
  protected INSTITUTION_NAME = environment.INSTITUTION_NAME;
  protected TIPOS_DE_ESPACIO_ACADEMICO = TIPOS_DE_ESPACIO_ACADEMICO;
  protected TIPO_DE_ESPACIO_ACADEMICO = TIPO_DE_ESPACIO_ACADEMICO;
  protected recurso_primeicon_map = recurso_primeicon_map;

  /* ............................... injectables .............................. */
  private api = inject(ApiService);
  private toast = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  /* .............................. data inicial .............................. */
  protected cantidad_de_espacios_academicos = this.route.snapshot.data[
    'cantidad_de_espacios_academicos'
  ] as CantidadDeEspaciosAcademicosDTO;
  protected espacios_academicos = this.route.snapshot.data[
    'espacios_academicos'
  ] as Paginated<EspacioAcademicoDTO>;

  /* ............................... components ............................... */

  protected upsert_espacio_academico_modal = viewChild.required(
    UpsertEspacioAcademicoModalComponent
  );
  protected eliminar_espacio_academico_modal = viewChild.required(
    EliminarEspacioAcaedemicoModalComponent
  );

  /* .................................. stado ................................. */
  protected loadings = {
    busqueda: false,
    registrando: false,
  };
  protected busqueda_input = new FormControl('');

  get puede_mostrar_modal() {
    return (
      this.puede_mostrar_modal_de_registro ||
      this.puede_mostrar_modal_de_actualizacion
    );
  }

  set puede_mostrar_modal(v) {
    if (v) return;
    this.puede_mostrar_modal_de_registro = v;
    this.puede_mostrar_modal_de_actualizacion = v;
  }

  puede_mostrar_modal_de_registro = false;
  puede_mostrar_modal_de_actualizacion = false;

  /* ................................. metodos ................................ */

  protected obtener_recursos_del_espacio(
    espacio_academico: EspacioAcademicoDTO
  ): Array<Recurso> {
    const map = new Map<number, Recurso>();

    for (const it of espacio_academico.recursos) {
      map.set(it.recurso.id, it.recurso);
    }

    return Array.from(map.values());
  }

  obtener_cantidad_segun_tipo_de_espacio(
    tipo_de_espacio_academico: TIPO_DE_ESPACIO_ACADEMICO
  ): CantidadDeEspaciosAcademicosDTO['espacios_academicos'][0] {
    return this.cantidad_de_espacios_academicos.espacios_academicos.find(
      (it) => it.tipo.id === tipo_de_espacio_academico
    )!;
  }

  async navigateOnDoubleClick(comands: any[]) {
    await this.router.navigate(comands);
  }

  /* ................................ comandos ................................ */

  get_opciones(espacio_academico: EspacioAcademicoDTO): MenuItem[] {
    return [
      {
        label: 'Opciones',
        items: [
          {
            label: 'Ver',
            icon: 'pi pi-eye',
            command: () => this.view_espacio_academico(espacio_academico),
          },
          {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => this.edit_espacio_academico(espacio_academico),
          },
          {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: () => this.delete_espacio_academico(espacio_academico),
          },
        ],
      },
    ];
  }

  view_espacio_academico(espacio_academico: EspacioAcademicoDTO) {
    console.log('se detecto click');
    this.router.navigate([
      'admin/espacios_academicos',
      espacio_academico.metadata.slug,
    ]);
  }
  edit_espacio_academico(espacio_academico: EspacioAcademicoDTO) {
    this.upsert_espacio_academico_modal().edit({
      id: espacio_academico.id,
      nombre: espacio_academico.nombre,
      tipo: espacio_academico.tipo.id,
      electricidad: espacio_academico.electricidad,
      internet: espacio_academico.internet,
      ventilacion: espacio_academico.ventilacion,
      capacidad: espacio_academico.capacidad,
    });
  }
  delete_espacio_academico(espacio_academico: EspacioAcademicoDTO) {
    //
  }

  /* ....................... cargar espacios academicos ....................... */

  async recargar_pagina() {
    this.api.client.espacios_academicos.obtener_cantidad_de_espacios_academicos
      .query()
      .then((r) => (this.cantidad_de_espacios_academicos = r));

    this.api.client.espacios_academicos.obtener_espacios_academicos
      .query()
      .then((r) => (this.espacios_academicos = r));
  }

  /* ............................ eliminar espacio ............................ */

  /* ............................ registrar espacio ........................... */

  on_upsert_espacio_academico_success(event: SuccessEvent) {
    if (event.method === 'registrar') {
      this.on_registrar_espacio_academico_success();
    } else if (event.method === 'editar') {
      this.on_actualizar_espacio_academico_success();
    }
  }

  on_registrar_espacio_academico_success() {
    this.toast.add({
      summary: 'Espacio académico ha sido registrado con exito',
      severity: 'success',
    });
  }

  on_actualizar_espacio_academico_success() {
    this.toast.add({
      summary: 'Espacio académico ha sido actualizado con exito',
      severity: 'success',
    });
  }

  mostrar_modal_de_registro() {
    this.upsert_espacio_academico_modal().create();
  }
}
