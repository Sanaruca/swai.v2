import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { TipoDeEspacioAcademicoTagComponent } from '../../../../../../common/components';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EspacioAcademicoDTO, TIPOS_DE_ESPACIO_ACADEMICO } from '@swai/core';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ApiService } from './../../../../../../services/api.service';

@Component({
  selector: 'aw-modal-upsert-espacio-academico',
  imports: [
        CommonModule,
        TipoDeEspacioAcademicoTagComponent,
        ButtonModule,
        TooltipModule,
        InputNumberModule,
        ReactiveFormsModule,
        CheckboxModule,
        DialogModule,
        SelectModule
  ],
  templateUrl: './upsert_espacio_academico.modal.component.html',
  styleUrl: './upsert_espacio_academico.modal.component.sass',
})
export class UpsertEspacioAcademicoModalComponent {

  /* ............................... injectables .............................. */

  private api = inject(ApiService);

  @Input() espacio_academico: EspacioAcademicoDTO | null = null;
  @Output() success = new EventEmitter<void>();


  /* ................................ constants ............................... */

  protected TIPOS_DE_ESPACIO_ACADEMICO = TIPOS_DE_ESPACIO_ACADEMICO

  /* .................................. state ................................. */

  protected visible = false
  protected loading = false

  protected form = new FormGroup({
    id: new FormControl<number | null>(null),
    nombre: new FormControl('', [Validators.required]),
    electricidad: new FormControl(false),
    ventilacion: new FormControl(false),
    internet: new FormControl(false),
    tipo: new FormControl<null | number>(null, [Validators.required]),
    capacidad: new FormControl<number>(30, [Validators.required]),
  });



  /* ................................... dom .................................. */

  @ViewChild('inputRef') inputRef!: ElementRef;

  /* ................................. getters ................................ */

  get modo(): 'registrar' | 'editar' {
    return this.espacio_academico? 'editar' : 'registrar';
  }

  /* ................................. metodos ................................ */

  protected async enviar_datos() {
    this.loading = true;
    try {
      const data = {
        nombre: this.form.controls.nombre.value!,
        tipo: this.form.controls.tipo.value!,
        electricidad: this.form.controls.electricidad.value!,
        internet: this.form.controls.internet.value!,
        ventilacion: this.form.controls.ventilacion.value!,
        capacidad: +this.form.controls.capacidad.value!,
      };

      if (this.modo === 'registrar') {
        await this.api.client.espacios_academicos.registrar_espacio_academico.mutate(
          data
        );

        this.success.emit()

      } else if (this.modo === 'editar') {
        await this.api.client.espacios_academicos.actualizar_espacio_academico.mutate(
          {
            id: this.form.controls.id.value!,
            actualizacion: data,
          }
        );

        this.success.emit()
      }


    } finally {
      this.loading = false;
    }
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

   protected  onDialogShow() {
    setTimeout(() => {
      this.inputRef.nativeElement.focus();
    }, 0);
  }

  protected onDialogHide() {
    this.form.reset(
      {
        capacidad: 30,
        electricidad: false,
        internet: false,
        ventilacion: false,
      },
      { onlySelf: true }
    );
  }

}
