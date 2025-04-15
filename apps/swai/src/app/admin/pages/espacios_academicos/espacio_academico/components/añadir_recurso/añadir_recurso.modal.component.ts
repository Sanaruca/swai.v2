import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  ESTADOS_DE_UN_RECURSO,
  RecursoDeUnEspacioAcademico,
  RECURSOS,
} from '@swai/core';
import { AñadirRecursoDTO } from '@swai/server';
import { EstadoDeUnRecursoTagComponent } from '../../../../../../common/components';
import { SelectModule } from 'primeng/select';
import { ApiService } from '../../../../../../services/api.service';

@Component({
  selector: 'aw-modal-anadir-recurso',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    SelectModule,
    InputNumberModule,
    ButtonModule,
    EstadoDeUnRecursoTagComponent,
  ],
  templateUrl: './añadir_recurso.modal.component.html',
  styleUrl: './añadir_recurso.modal.component.scss',
})
export class AñadirRecursoModalComponent {
  private api = inject(ApiService);

  @Input() espacio_academico?: number;

  // Outputs
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() submit = new EventEmitter<AñadirRecursoDTO>();
  @Output() success = new EventEmitter<RecursoDeUnEspacioAcademico>();
  @Output() cancel = new EventEmitter<void>();

  loading = false;

  visible = false;
  recurso_del_espacio!: FormGroup;

  recursos = RECURSOS;

  estados = ESTADOS_DE_UN_RECURSO;

  private fb = inject(FormBuilder);

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.recurso_del_espacio = this.fb.group({
      recurso: [null, Validators.required],
      espacio_academico: [this.espacio_academico || null, Validators.required],
      estado: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });

    // If academicSpaceId is provided, set it in the form
    if (this.espacio_academico) {
      this.recurso_del_espacio
        .get('espacio_academico')
        ?.setValue(this.espacio_academico);
    }
  }

  showDialog() {
    this.visible = true;
    this.visibleChange.emit(true);
  }

  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancel.emit();
  }

  async onSubmit() {
    if (this.recurso_del_espacio.invalid) {
      this.recurso_del_espacio.markAllAsTouched();
      return;
    }

    this.loading = true;
    try {
      const formData = this.recurso_del_espacio.value;
      this.submit.emit(formData);
      const recurso_del_espacio =
        await this.api.client.recursos.añadir_recurso.mutate(formData);
      this.success.emit(recurso_del_espacio);
      this.hideDialog();
    } finally {
      this.loading = false;
    }
  }
}
