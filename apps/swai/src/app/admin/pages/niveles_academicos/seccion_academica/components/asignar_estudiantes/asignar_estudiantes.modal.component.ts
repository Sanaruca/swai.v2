import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { EstudianteDTO, Seccion, NumberCondicion, NullableCondicion } from '@swai/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ApiService } from '../../../../../../services/api.service';
import { Avatar } from 'primeng/avatar';
import { NombrePipe } from '../../../../../../common/pipes/nombre.pipe';
import { ButtonModule } from 'primeng/button';
import { SeccionTagComponent } from '../../../../../../common/components';
@Component({
  selector: 'aw-modal-asignar-estudiantes',
  imports: [CommonModule, DialogModule, IconFieldModule, InputIconModule, InputTextModule, ReactiveFormsModule, Avatar, NombrePipe, ButtonModule, SeccionTagComponent],
  templateUrl: './asignar_estudiantes.modal.component.html',
  styleUrl: './asignar_estudiantes.modal.component.sass',
})
export class AsignarEstudiantesModalComponent implements OnInit{
  visible = false;
  @Input() seccion!: Seccion;


  /* ............................... injectables .............................. */
  private api = inject(ApiService)

  /* .................................. state ................................. */
  protected estudiantes_form = new FormGroup({
    nombre: new FormControl<string>(''),
  })

  protected busqueda_estudiantes: EstudianteDTO[] =  []

  protected estudiantes: EstudianteDTO[] =  []
  protected estudiantes_sugeridos: EstudianteDTO[] =  []

  /* .............................. ciclo de vida ............................. */
  ngOnInit(): void {
    this.estudiantes_form.controls.nombre.valueChanges.pipe(debounceTime(300)).subscribe(
      async (v) => {

        if (!v) return

        this.busqueda_estudiantes = (await this.api.client.estudiantes.obtener_estudiantes.query({
          por_nombre: v,
          filtros: [
            {
              campo: 'nivel_academico',
              condicion: NumberCondicion.IGUAL,
              valor: this.seccion.nivel_academico,
            }
          ]
        })).data
      }
    )
  }

  toggle() {
    this.visible = !this.visible

    if (this.visible) {
      this.cargar_sugerencias().then()
    }

  }

  agregar(estudiante: EstudianteDTO) {
    this.estudiantes = [...this.estudiantes, estudiante]
  }

  remover(index: number) {
    this.estudiantes.splice(index, 1)
    this.estudiantes = [...this.estudiantes]
  }

  private async cargar_sugerencias() {
    this.estudiantes_sugeridos = (await this.api.client.estudiantes.obtener_estudiantes.query({
      filtros: [
        {
          campo: 'nivel_academico',
          condicion: NumberCondicion.IGUAL,
          valor: this.seccion.nivel_academico,
        },
        {
          campo: 'seccion',
          condicion: NullableCondicion.IGUAL,
          valor: null,
        }
      ]
    })).data
  }

}
