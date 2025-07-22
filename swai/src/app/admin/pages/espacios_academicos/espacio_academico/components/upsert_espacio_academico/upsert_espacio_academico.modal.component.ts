import {
    Component,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { TipoDeEspacioAcademicoTagComponent } from '../../../../../../common/components';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { EspacioAcademico, TIPOS_DE_ESPACIO_ACADEMICO } from '@swai/core';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ApiService } from './../../../../../../services/api.service';
import { InputTextModule } from 'primeng/inputtext';

export interface SuccessEvent {
  method: 'registrar' | 'editar';
}

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
    SelectModule,
    InputTextModule,
  ],
  templateUrl: './upsert_espacio_academico.modal.component.html',
  styleUrl: './upsert_espacio_academico.modal.component.css',
})
export class UpsertEspacioAcademicoModalComponent {
  /* ............................... injectables .............................. */

  private api = inject(ApiService);

  @Input() protected espacio_academico: Omit<
    EspacioAcademico,
    'metadata'
  > | null = null;
  @Input() protected close_on_success = true;
  @Output() protected success = new EventEmitter<SuccessEvent>();
  @Output() protected fail = new EventEmitter<Error>();

  /* ................................ constants ............................... */

  protected TIPOS_DE_ESPACIO_ACADEMICO = TIPOS_DE_ESPACIO_ACADEMICO;

  /* .................................. state ................................. */

  protected visible = false;
  protected loading = false;

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
    return this.espacio_academico ? 'editar' : 'registrar';
  }

  /* ................................. metodos ................................ */

  protected async enviar_datos() {
    this.loading = true;
    try {
      const data = {
        nombre: this.form.controls.nombre.value!,
        tipo: this.form.controls.tipo.value!,
        electricidad: !!this.form.controls.electricidad.value,
        internet: !!this.form.controls.internet.value,
        ventilacion: !!this.form.controls.ventilacion.value,
        capacidad: +this.form.controls.capacidad.value!,
      };

      if (this.modo === 'registrar') {
        await this.api.client.espacios_academicos.registrar_espacio_academico.mutate(
          data
        );

        this.success.emit({ method: 'registrar' });
        if (this.close_on_success) {
          this.close();
        }
      } else if (this.modo === 'editar') {
        await this.api.client.espacios_academicos.actualizar_espacio_academico.mutate(
          {
            id: this.form.controls.id.value!,
            actualizacion: data,
          }
        );

        this.success.emit({ method: 'editar' });
        if (this.close_on_success) {
          this.close();
        }
      }
    } catch (error) {
      if (error instanceof Error) this.fail.emit(error);
    } finally {
      this.loading = false;
    }
  }

  create() {
    this.reset();
    this.visible = true;
  }

  close() {
    this.visible = false;
    this.reset();
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  edit(espacio_academico: Omit<EspacioAcademico, 'metadata'>) {
    this.espacio_academico = espacio_academico;
    this.form.setValue({
      id: espacio_academico.id,
      nombre: espacio_academico.nombre,
      tipo: espacio_academico.tipo,
      electricidad: espacio_academico.electricidad,
      internet: espacio_academico.internet,
      ventilacion: espacio_academico.ventilacion,
      capacidad: espacio_academico.capacidad,
    });
    this.visible = true;
  }

  protected reset() {
    this.form.reset(
      {
        capacidad: 30,
        electricidad: true,
        internet: false,
        ventilacion: false,
      },
      { onlySelf: true }
    );
  }

  protected onDialogShow() {
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
