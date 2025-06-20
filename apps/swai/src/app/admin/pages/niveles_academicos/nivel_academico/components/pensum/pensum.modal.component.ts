import { Component, inject, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { AreaDeFromacion, PensumDTO } from '@swai/core';
import { ApiService } from '../../../../../../services/api.service';
import { Skeleton } from 'primeng/skeleton';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'aw-modal-pensum',
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    SelectModule,
    Tag,
    Skeleton,
    ReactiveFormsModule,
    InputNumberModule,
    FormsModule,
    TooltipModule
  ],
  templateUrl: './pensum.modal.component.html',
  styleUrl: './pensum.modal.component.sass',
})
export class PensumModalComponent implements OnInit {
  /* ............................... injectables .............................. */

  private api = inject(ApiService);

  /* ................................. inputs ................................. */

  nivel_academico = input.required<number>();
  close_on_success = input<boolean>(false);

  /* ................................. outputs ................................ */

  protected success = output<PensumDTO>();

  /* .................................. state ................................. */
  protected areas_de_formacion: AreaDeFromacion[] = [];
  protected pensum: PensumDTO | null = null;
  get areas_de_formacion_no_asignadas() {
    return this.areas_de_formacion.filter(
      (area_de_formacion) =>
        !this.pensum?.areas_de_formacion.some(
          (area) => area.codigo === area_de_formacion.codigo
        )
    );
  }
  get resumen() {
    if (!this.pensum) {
      return {
        materias: 0,
        horas_semanales: 0,
        promedio_materia: 0,
      };
    }

    const horas_semanales = this.pensum.areas_de_formacion.reduce(
      (total, area_de_formacion) => total + area_de_formacion.horas,
      0
    );

    return {
      materias: this.pensum.areas_de_formacion.length,
      horas_semanales,
      promedio_materia:
        +(horas_semanales / this.pensum.areas_de_formacion.length).toFixed(0) ||
        0,
    };
  }

  protected visible = false;
  protected loadings = {
    data: false,
    save: false,
  };

  /* .................................. forms ................................. */

  protected agregar_mataria_form = new FormGroup({
    area_de_formacion: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    horas_semanales: new FormControl<number>(1, [Validators.required]),
  });

  /* ................................. metodos ................................ */

  open() {
    this.visible = true;
    this.load_data();
  }

  close() {
    this.visible = false;
  }

  protected agregar_materia() {
    const data = this.agregar_mataria_form.value;

    if (this.pensum) {
      this.pensum.areas_de_formacion = [
        {
          codigo: data.area_de_formacion!,
          horas: data.horas_semanales!,
          nombre: this.areas_de_formacion.find(
            (area) => area.codigo === data.area_de_formacion
          )!.nombre,
        },
        ...this.pensum.areas_de_formacion,
      ];
      
      this.agregar_mataria_form.reset();
    }

  }
  protected remover_materia(codigo: string) {

    if (this.pensum) {
      this.pensum.areas_de_formacion = this.pensum.areas_de_formacion.filter(
        (area) => area.codigo !== codigo
      );
    }

    

  }

  async guardar() {
    if (!this.pensum) {
      return;
    }
    this.loadings.save = true;
    try {
      const pensum = await this.api.client.niveles_academicos.cambiar_pensum.mutate({
        nivel_academico: this.nivel_academico(),
        pensum: this.pensum.areas_de_formacion.map((area_de_formacion) => ({
          area_de_formacion: area_de_formacion.codigo,
          horas: area_de_formacion.horas,
        })),
      });
      this.success.emit(pensum);
      if (this.close_on_success()) {
        this.close();
      }
    } finally {
      this.loadings.save = false;
    }
  }

  /* .............................. ciclo de vida ............................. */

  ngOnInit(): void {
    this.agregar_mataria_form.controls.horas_semanales.valueChanges.subscribe(
      (horas_semanales) => {
        if (!horas_semanales) {
          this.agregar_mataria_form.controls.horas_semanales.setValue(1);
        }
      }
    );
  }

  /* ................................. private ................................ */

  private async load_data() {
    this.loadings.data = true;

    try {
      const [pensum, areas_de_formacion] = await Promise.all([
        this.api.client.institucion.obtener_pensum.query({
          nivel_academico: this.nivel_academico(),
        }) as Promise<PensumDTO>,
        this.api.client.institucion.obtener_areas_de_formacion.query(),
      ] as const);

      this.areas_de_formacion = areas_de_formacion;
      this.pensum = pensum;
    } finally {
      this.loadings.data = false;
    }
  }
}
