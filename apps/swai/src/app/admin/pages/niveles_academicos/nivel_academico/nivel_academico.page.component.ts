import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CantidadDeEstudiantesPorNivelAcademicoDTO } from '@swai/server';
import { InfoCardComponent } from '../../../../admin/components';
import { obtener_color_seccion_class } from '../utils';
import { EstudianteDTO, PensumDTO } from '@swai/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Paginated } from '@swai/server';
import { AvatarModule } from 'primeng/avatar';
import {
  EstadoAcademicoTagComponent,
  SexoTagComponent,
  SeccionTagComponent,
  IllustrationComponent
} from '../../../../common/components';
import { MomentModule } from 'ngx-moment';
import { ApiService } from '../../../../services/api.service';
import { SkeletonModule } from 'primeng/skeleton';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'aw-nivel-academico.page',
  imports: [
    CommonModule,
    InputIconModule,
    IconFieldModule,
    InfoCardComponent,
    TableModule,
    AvatarModule,
    SexoTagComponent,
    EstadoAcademicoTagComponent,
    MomentModule,
    SeccionTagComponent,
    SkeletonModule,
    InputTextModule,
    ReactiveFormsModule,
    IllustrationComponent,
    TagModule,
    ButtonModule,
    MenuModule,
    TooltipModule,
  ],
  templateUrl: './nivel_academico.page.component.html',
  styleUrl: './nivel_academico.page.component.scss',
})
export class NivelAcademicoPageComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  protected cantidad_de_estudiantes: CantidadDeEstudiantesPorNivelAcademicoDTO =
    this.route.snapshot.data['cantidad_de_estudiantes'];
  protected pensum: PensumDTO = this.route.snapshot.data['pensum'];
  protected estudiantes: Paginated<EstudianteDTO> =
    this.route.snapshot.data['estudiantes'];
  protected loading = false;

  protected busqueda_input = new FormControl<string>('');

  @ViewChildren(Menu) table_row_menus!: QueryList<Menu>;

  ngOnInit(): void {
    this.busqueda_input.valueChanges
      .pipe(debounceTime(200))
      .subscribe((input) => {
        this.busqueda(input + '');
      });
  }

  ngAfterViewInit(): void {}

  toggle_row_menu(event: Event, index: number) {
    event.stopPropagation();
    this.table_row_menus.get(index)?.show(event);
  }

  getActions(estudiante: EstudianteDTO) {
    return [
      {
        label: 'Ver Estudiante',
        icon: 'pi pi-eye',
        command: () => this.viewStudent(estudiante),
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.editStudent(estudiante),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.deleteStudent(estudiante),
      },
    ];
  }

  viewStudent(student: any) {
    console.log('Ver estudiante:', student);
  }

  editStudent(student: any) {
    console.log('Editar estudiante:', student);
  }

  deleteStudent(student: any) {
    console.log('Eliminar estudiante:', student);
  }

  obtener_color_seccion_class(seccion: string, contraste = false) {
    return obtener_color_seccion_class(seccion, contraste);
  }

  obtener_iniciales(estudiante: EstudianteDTO): string {
    return (
      estudiante.nombres.charAt(0) + estudiante.apellidos.charAt(0)
    ).toUpperCase();
  }

  obtener_nombre(estudiante: EstudianteDTO): string {
    return `${estudiante.nombres.split(' ').at(0)} ${estudiante.apellidos
      .split(' ')
      .at(0)}`;
  }

  /** @internal */ protected html_input_element(target: any): HTMLInputElement {
    return target;
  }

  async busqueda(nombre: string) {
    this.loading = true;

    try {
      this.estudiantes =
        await this.api.client.estudiantes.obtener_estudiantes.query({
          por_nombre: nombre,
          por_nivel_academico: [this.pensum.nivel_academico.numero],
          paginacion: {
            limit: this.estudiantes.limit,
          },
        });
    } finally {
      this.loading = false;
    }
  }

  async cargar_estudiantes(event: TableLazyLoadEvent) {
    // Parámetros de paginación
    const page = event.first! / event.rows!;
    const limit = event.rows!;

    if (page + 1 === this.estudiantes.page) return;

    this.loading = true;

    // Llamada a la API
    this.api.client.estudiantes.obtener_estudiantes
      .query({
        paginacion: { page: page + 1, limit },
        por_nivel_academico: [this.pensum.nivel_academico.numero],
        por_nombre: this.busqueda_input.value || '',
      })
      .then((data) => {
        this.estudiantes = data;
      })
      .finally(() => (this.loading = false));
  }
  async navigateOnDoubleClick(comands: any[]) {
    await this.router.navigate(comands);
  }
}
