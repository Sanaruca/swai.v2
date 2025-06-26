import { Component, inject, output, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../../../services/api.service';
import { AppStateService } from '../../../../../../services/appstate.service';
import { ESTADO_ACADEMICO, generar_matricula_de_estudiantes, Matricula, NIVEL_ACADEMICO_CARDINAL_MAP, NumberCondicion, StringCondicion } from '@swai/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'aw-modal-exportar-estudiantes',
  imports: [CommonModule, DialogModule, ButtonModule, ReactiveFormsModule, TooltipModule],
  templateUrl: './exportar_estudiantes.modal.component.html',
  styleUrl: './exportar_estudiantes.modal.component.sass',
})
export class ExportarEstudiantesModalComponent {

  private app = inject(AppStateService)
  private api = inject(ApiService)

  protected loadings = {
    exportar: false,
  }

  close_on_success = input(false)
  nivel_academico = input.required<number>()
  success = output<void>()

  protected visible = signal(false)

  protected form = new FormGroup({
    tipo: new FormControl<'estudiantes' | 'matricula' | null>(null),
  })

  open() {
    this.visible.set(true)
  }

  close() {
    this.form.reset()
    this.visible.set(false)
  }

  protected async exportar() {
    this.loadings.exportar = true
    const matriculas: Matricula[] = []

    try {

      const secciones_academicas = await this.api.client.niveles_academicos.obtener_secciones_academicas.query({ nivel_academico: this.nivel_academico() })

      secciones_academicas.data.forEach(
        seccion => {
          matriculas.push({
            institucion: this.app.institucion,
            nivel_academico: this.nivel_academico(),
            seccion: seccion.seccion,
            estudiantes: [],
            periodo_academico: '2023-2024',
            fecha_de_la_matricula: new Date(),
          })
        }
      )

      const estudiantes = await Promise.all(
        matriculas.map(
          (matricula) => this.api.client.estudiantes.obtener_estudiantes.query({
            filtros: [
              {
                campo: 'seccion',
                condicion: StringCondicion.IGUAL,
                valor: `${this.nivel_academico()}${matricula.seccion}`,
              },
              {
                campo: 'estado_academico',
                condicion: NumberCondicion.IGUAL,
                valor: ESTADO_ACADEMICO.ACTIVO,
              },
            ],
            paginacion: {
              page: 1,
              limit: 100,
            },
          })
        )
      )

      await generar_matricula_de_estudiantes(matriculas, `matriculas_${NIVEL_ACADEMICO_CARDINAL_MAP[this.nivel_academico()]}`)
      this.success.emit()

      if (this.close_on_success()) {
        this.close()
      }



    } finally {
      this.loadings.exportar = false
    }
  }
}
