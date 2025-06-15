import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../../../../services/api.service';
import {
  ESTADO_ACADEMICO,
  EstudianteDTO,
  NIVELES_ACADEMICOS_MAP,
  NumberCondicion,
  Seccion as CoreSeccion,
  StringCondicion,
} from '@swai/core';
import { Tag } from 'primeng/tag';
import {
  NivelAcademicoTagComponent,
  SeccionTagComponent,
} from '../../../../../../common/components';
import { NombrePipe } from '../../../../../../common/pipes/nombre.pipe';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Avatar } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { AccordionModule } from 'primeng/accordion';
import { Skeleton } from 'primeng/skeleton';

interface Seccion extends CoreSeccion {
  estudiantes: EstudianteDTO[];
}

@Component({
  selector: 'aw-modal-promover-nivel-academico',
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    Tag,
    NivelAcademicoTagComponent,
    ReactiveFormsModule,
    Avatar,
    NombrePipe,
    SeccionTagComponent,
    TooltipModule,
    AccordionModule,
    Skeleton
  ],
  templateUrl: './promover_nivel_academico.modal.component.html',
  styleUrl: './promover_nivel_academico.modal.component.sass',
})
export class PromoverNivelAcademicoModalComponent {
  /* ............................... injectables .............................. */

  private api = inject(ApiService);

  /* ................................. inputs ................................. */

  nivel_academico = input.required<number>();

  /* ................................. outputs ................................ */

  success = output();

  /* .................................. state ................................. */

  protected loadings = {
    data: false,
    promocion: false,
  };

  protected nivel_academico_actual = computed(
    () => NIVELES_ACADEMICOS_MAP[this.nivel_academico()]
  );
  protected nivel_academico_destino = computed(
    () => NIVELES_ACADEMICOS_MAP[this.nivel_academico() + 1]
  );

  protected visible = false;
  protected paso_actual = 1;

  protected form = new FormGroup({
    tipo_de_promocion: new FormControl<'auto' | 'manual' | null>(null),
    estudiantes: new FormControl<EstudianteDTO[]>([]),
  });

  protected secciones_academicas: Seccion[] = [];

  /* ................................. metodos ................................ */

  open() {
    this.reset();
    this.load_data();
    this.visible = true;
  }

  close() {
    this.reset();
    this.visible = false;
  }

  async promover() {
    this.loadings.promocion = true;
    try {

      await this.api.client.niveles_academicos.promover_estudiantes.mutate({
        nivel_academico: this.nivel_academico(),
        estudiantes: this.form.controls.estudiantes.value!.length
        ? this.form.controls.estudiantes.value!.map(
          (estudiante) => estudiante.cedula
        )
        : undefined,
      });
      this.success.emit();
      this.close();

    } finally {
      this.loadings.promocion = false;
    }

  }

  private reset() {
    this.paso_actual = 1;
    this.form.reset({
      estudiantes: [],
      tipo_de_promocion: null,
    });
  }

  load_data() {
    this.loadings.data = true;

    this.api.client.estudiantes.obtener_estudiantes
      .query({
        filtros: [
          {
            campo: 'nivel_academico',
            condicion: NumberCondicion.IGUAL,
            valor: this.nivel_academico(),
          },
          {
            campo: 'estado_academico',
            condicion: NumberCondicion.IGUAL,
            valor: ESTADO_ACADEMICO.ACTIVO,
          },
          {
            campo: 'seccion',
            condicion: StringCondicion.DISTINTO,
            valor: null,
          },
        ],
        paginacion: {
          page: 1,
          limit: 100,
        },
      })
      .then((estudiantes) => {
        this.set_secciones_academicas(estudiantes.data);
      })
      .finally(() => {
        this.loadings.data = false;
      });
  }

  private set_secciones_academicas(estudiantes: EstudianteDTO[]) {
    const map = new Map<string, Seccion>();

    estudiantes.forEach((estudiante) => {
      const seccion = map.get(estudiante.seccion!.id);
      if (seccion) {
        seccion.estudiantes.push(estudiante);
      } else {
        map.set(estudiante.seccion!.id, {
          id: estudiante.seccion!.id,
          seccion: estudiante.seccion!.seccion,
          nivel_academico: estudiante.seccion!.nivel_academico,
          profesor_guia: null,
          estudiantes: [estudiante],
        });
      }
    });

    this.secciones_academicas = Array.from(map.values()).sort((a, b) =>
      a.seccion.localeCompare(b.seccion)
    );
  }
}
