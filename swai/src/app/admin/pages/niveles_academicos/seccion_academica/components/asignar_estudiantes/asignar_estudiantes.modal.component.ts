import {
    Component,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import {
    EstudianteDTO,
    Seccion,
    NumberCondicion,
    NullableCondicion,
    Filtro,
    StringCondicion,
} from '@swai/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ApiService } from '../../../../../../services/api.service';
import { Avatar } from 'primeng/avatar';
import { NombrePipe } from '../../../../../../common/pipes/nombre.pipe';
import { ButtonModule } from 'primeng/button';
import { SeccionTagComponent } from '../../../../../../common/components';
import { OverlayModule } from 'primeng/overlay';
@Component({
  selector: 'aw-modal-asignar-estudiantes',
  imports: [
    CommonModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ReactiveFormsModule,
    Avatar,
    NombrePipe,
    ButtonModule,
    SeccionTagComponent,
    OverlayModule,
  ],
  templateUrl: './asignar_estudiantes.modal.component.html',
  styleUrl: './asignar_estudiantes.modal.component.css',
})
export class AsignarEstudiantesModalComponent implements OnInit {
  visible = false;
  @Input() seccion!: Seccion;
  @Output() success = new EventEmitter<void>();

  @ViewChild('busqueda_input') busqueda_input!: ElementRef<HTMLInputElement>;

  /* ............................... injectables .............................. */
  private api = inject(ApiService);

  /* .................................. state ................................. */
  protected estudiantes_form = new FormGroup({
    nombre: new FormControl<string>(''),
  });

  protected busqueda_estudiantes: EstudianteDTO[] = [];

  protected estudiantes_seleccionados: EstudianteDTO[] = [];
  protected estudiantes_sugeridos: EstudianteDTO[] = [];

  protected puede_mostrar_busquedas = false;

  protected loadings = {
    enviando: false,
  };

  /* .............................. ciclo de vida ............................. */
  ngOnInit(): void {
    this.estudiantes_form.controls.nombre.valueChanges
      .pipe(debounceTime(300))
      .subscribe(async (v) => {
        if (!v) return;

        this.busqueda_estudiantes = (
          await this.api.client.estudiantes.obtener_estudiantes.query({
            por_nombre: v,
            filtros: [
              {
                campo: 'nivel_academico',
                condicion: NumberCondicion.IGUAL,
                valor: this.seccion.nivel_academico,
              },
              {
                campo: 'seccion',
                condicion: StringCondicion.DISTINTO,
                valor: this.seccion.id,
              },
              ...this.estudiantes_seleccionados.map<Filtro<'cedula', number>>(
                (estudiante) => ({
                  campo: 'cedula',
                  condicion: NumberCondicion.DISTINTO,
                  valor: estudiante.cedula,
                })
              ),
            ],
          })
        ).data;
      });
  }

  /* ................................. metodos ................................ */

  async asignar_estudiantes() {
    this.loadings.enviando = true;
    try {
      await this.api.client.secciones_academicas.asignar_estudiantes.mutate({
        seccion: this.seccion.id,
        estudiantes: this.estudiantes_seleccionados.map(
          (estudiante) => estudiante.cedula
        ),
      });

      this.success.emit();
      this.cerrar();
    } finally {
      this.loadings.enviando = false;
    }
  }

  cerrar() {
    this.estudiantes_sugeridos = [];
    this.estudiantes_seleccionados = [];
    this.visible = false;
  }

  toggle() {
    this.visible = !this.visible;

    if (this.visible) {
      this.cargar_sugerencias().then();
    }
  }

  agregar(estudiante: EstudianteDTO) {
    this.estudiantes_seleccionados = [
      ...this.estudiantes_seleccionados,
      estudiante,
    ];
  }

  remover(index: number) {
    this.estudiantes_seleccionados.splice(index, 1);
    this.estudiantes_seleccionados = [...this.estudiantes_seleccionados];
  }

  protected async cargar_sugerencias() {
    this.estudiantes_sugeridos = (
      await this.api.client.estudiantes.obtener_estudiantes.query({
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
          },
          ...this.estudiantes_seleccionados.map<Filtro<'cedula', number>>(
            (estudiante) => ({
              campo: 'cedula',
              condicion: NumberCondicion.DISTINTO,
              valor: estudiante.cedula,
            })
          ),
        ],
      })
    ).data;
  }
}
