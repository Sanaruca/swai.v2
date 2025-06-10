import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FastLinkComponent
} from '../../../admin/components';
import { PensumDTO } from '@swai/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CantidadDeEstudiantesDTO } from '@swai/server';
import { TagModule } from 'primeng/tag';
import { EditableNivelAcademicoComponent, NivelAcademico } from './components/editable_nivel_academico/editable_nivel_academico.component';


@Component({
  selector: 'aw-niveles-academicos.page',
  imports: [
    CommonModule,
    FastLinkComponent,
    TagModule,
    RouterLink,
    EditableNivelAcademicoComponent
  ],
  templateUrl: './niveles_academicos.page.component.html',
  styleUrl: './niveles_academicos.page.component.scss',
})
export class NivelesAcademicosPageComponent {
  private route = inject(ActivatedRoute);
  protected pensum: PensumDTO[] = this.route.snapshot.data['pensum'];
  protected cantidad_de_estudiantes: CantidadDeEstudiantesDTO =
    this.route.snapshot.data['cantidad_de_estudiantes'];


    obtener_nivel_academico_prop(pensum: PensumDTO): NivelAcademico{

      const nivel_academico = pensum.nivel_academico

      const cantidad_de_estudiantes = this.cantidad_de_estudiantes.niveles_academicos.find((it) => it.numero === nivel_academico.numero)

      const secciones = this.cantidad_de_estudiantes.niveles_academicos.find(
        (it) => it.numero === nivel_academico.numero
      )?.secciones.map((it) => ({
        id: it.id,
        seccion: it.seccion,
        nivel_academico: it.nivel_academico,
        cantidad_de_estudiantes: {
          activos: it.activos,
          no_inscritos: it.no_inscritos,
          retirados: it.retirados,
          total: it.total,
        }
      }));

      return {
        ...nivel_academico,
        cantidad_de_estudiantes: {
          activos: cantidad_de_estudiantes?.activos?? 0,
          no_inscritos: cantidad_de_estudiantes?.no_inscritos?? 0,
          retirados: cantidad_de_estudiantes?.retirados?? 0,
          total: cantidad_de_estudiantes?.total?? 0,
        },
        secciones: secciones ?? [],
        pensum: pensum.areas_de_formacion,
      }
    }



}
