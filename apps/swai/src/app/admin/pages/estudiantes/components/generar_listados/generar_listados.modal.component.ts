import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

// TODO: 

@Component({
  selector: 'aw-modal-generar-listados',
  imports: [CommonModule, ButtonModule, DialogModule],
  templateUrl: './generar_listados.modal.component.html',
  styleUrl: './generar_listados.modal.component.scss',
})
export class GenerarListadosModalComponent {
  @Input() visible = false;
}
