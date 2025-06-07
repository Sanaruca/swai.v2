import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

// TODO: 

@Component({
  selector: 'aw-modal-generar-listados',
  imports: [CommonModule, ButtonModule, DialogModule, ReactiveFormsModule],
  templateUrl: './generar_listados.modal.component.html',
  styleUrl: './generar_listados.modal.component.scss',
})
export class GenerarListadosModalComponent {
  @Input() protected visible = false;

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  /* .................................. state ................................. */
  protected form = new FormGroup({
    tipo_de_listado: new FormControl<'por_seccion' | 'por_nivel' | null>(null),
  });
}
