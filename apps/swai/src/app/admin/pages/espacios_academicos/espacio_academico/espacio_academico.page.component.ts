import { Component, inject, OnInit, PLATFORM_ID, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RecursosDeUnEspacioAcademicoDTO } from '@swai/server';
import {
  IllustrationComponent,
  TipoDeEspacioAcademicoTagComponent,
} from '../../../../common/components';
import { Tag } from 'primeng/tag';
import { recurso_primeicon_map } from '../../../../common/utils';
import { TableModule } from 'primeng/table';
import { EstadoDeUnRecursoTagComponent } from '../../../../common/components/estado_de_un_recurso.tag.component';
import {
  EstadoDeUnRecurso,
  ESTADOS_DE_UN_RECURSO,
  RECURSO,
  RecursoDeUnEspacioAcademico,
  RECURSOS,
  EspacioAcademicoDTO,
  Recurso,
} from '@swai/core';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AñadirRecursoModalComponent } from './components';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { UpsertEspacioAcademicoModalComponent } from './components/upsert_espacio_academico/upsert_espacio_academico.modal.component';
import { EliminarEspacioAcaedemicoModalComponent } from '../components';

function clone_object<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

interface RecursoDetalle {
  id: string;
  recurso_id: number;
  estado: EstadoDeUnRecurso;
  cantidad: number;
}

interface IRecurso extends Recurso {
  estados: number[];
  cantidad: number;
  detalles: {
    data: RecursoDetalle[];
    chart?: {
      data: number[];
      backgroundColor?: string[];
      hoverBackgroundColor?: string[];
    };
  };
}

@Component({
  selector: 'aw-espacio-academico.page',
  imports: [
    CommonModule,
    TipoDeEspacioAcademicoTagComponent,
    Tag,
    TableModule,
    EstadoDeUnRecursoTagComponent,
    ButtonModule,
    ChartModule,
    TooltipModule,
    MenuModule,
    AñadirRecursoModalComponent,
    IllustrationComponent,
    InputNumberModule,
    FormsModule,
    UpsertEspacioAcademicoModalComponent,
    EliminarEspacioAcaedemicoModalComponent,
  ],
  templateUrl: './espacio_academico.page.component.html',
  styleUrl: './espacio_academico.page.component.scss',
})
export class EspacioAcademicoPageComponent implements OnInit {
  /* ............................... injectables .............................. */
  private router = inject(Router);
  private toast = inject(MessageService);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  /* .................................. state ................................. */
  expandedRows: Record<string, boolean> = {};
  data!: object;
  platformId = inject(PLATFORM_ID);

  options = {
    cutout: '60%',
  };

  protected detalles_clonados: Map<string, RecursoDetalle> = new Map();

  /* ............................... components ............................... */

  protected upsert_espacio_academico_modal = viewChild.required(
    UpsertEspacioAcademicoModalComponent
  );
  protected eliminar_espacio_academico_modal = viewChild.required(
    EliminarEspacioAcaedemicoModalComponent
  );

  /* .................................. menu .................................. */
  protected menu_options = [
    {
      label: 'Opciones',
      items: [
        {
          label: 'Editar Espacio',
          icon: 'pi pi-pencil',
          command: () => {
            this.upsert_espacio_academico_modal().edit({
              id: this.espacio_academico.id,
              nombre: this.espacio_academico.nombre,
              tipo: this.espacio_academico.tipo.id,
              electricidad: this.espacio_academico.electricidad,
              internet: this.espacio_academico.internet,
              ventilacion: this.espacio_academico.ventilacion,
              capacidad: this.espacio_academico.capacidad,
            });
          },
        },
        {
          label: 'Eliminar Espacio',
          icon: 'pi pi-trash',
          command: () => {
            this.eliminar_espacio_academico_modal().open({
              id: this.espacio_academico.id,
              nombre: this.espacio_academico.nombre,
              tipo: this.espacio_academico.tipo.id,
              electricidad: this.espacio_academico.electricidad,
              internet: this.espacio_academico.internet,
              ventilacion: this.espacio_academico.ventilacion,
              capacidad: this.espacio_academico.capacidad,

            });
          },
        },
      ],
    },
  ] as MenuItem[];
  /* .................................... . ................................... */

  protected ESTADOS_DE_UN_RECURSO = ESTADOS_DE_UN_RECURSO;

  /* .............................. data inicial .............................. */

  protected espacio_academico = this.route.snapshot.data[
    'espacio_academico'
  ] as EspacioAcademicoDTO;

  protected cantidad_de_recursos = this.route.snapshot.data[
    'cantidad_de_recursos'
  ] as RecursosDeUnEspacioAcademicoDTO;

  protected resumen_cantidad_de_recursos = ((component) => {
    const estados = ESTADOS_DE_UN_RECURSO.map((estado) => ({
      ...estado,
      recursos: this.cantidad_de_recursos.recursos.reduce<
        typeof this.cantidad_de_recursos.recursos
      >((acc, recurso) => {
        const estado_del_recurso = recurso.estados.at(estado.id - 1)!;
        const tiene_instancias = estado_del_recurso.total > 0;

        if (!tiene_instancias) return acc;

        return [...acc, { ...recurso, total: estado_del_recurso.total }];
      }, []),
      total: this.cantidad_de_recursos.recursos.reduce(
        (suma, recurso) => recurso.estados.at(estado.id - 1)!.total + suma,
        0
      ),
      get porcentaje() {
        return (
          parseFloat(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            ((this.total / component.cantidad_de_recursos.total) * 100).toFixed(
              2
            )
          ) || 0
        );
      },
    }));

    return {
      estados,
      chart: {
        datasets: [
          {
            data: estados.map((estado) => estado.total),
            backgroundColor: [
              '#22c55e',
              '#14b8a6',
              '#eab308',
              '#ef4444',
              '#6b7280',
            ],
            hoverBackgroundColor: [
              '#4ade80',
              '#2dd4bf',
              '#facc15',
              '#f87171',
              '#9ca3af',
            ],
          },
        ],
      },
    };
  })(this);

  protected recursos = Array.from(
    this.espacio_academico.recursos
      .reduce((acc, it) => {
        const recurso = acc.get(it.recurso.id);

        if (!recurso) {
          const detalles = ESTADOS_DE_UN_RECURSO.map<RecursoDetalle>(
            (estado) => {
              return {
                id: `R${it.recurso.id}E${estado.id}`,
                recurso_id: it.recurso.id,
                estado,
                cantidad: estado.id === it.estado.id ? it.cantidad : 0,
              };
            }
          );

          acc.set(it.recurso.id, {
            id: it.recurso.id,
            nombre: it.recurso.nombre,
            estados: new Set<number>([it.estado.id]),
            cantidad: it.cantidad,
            detalles,
          });
        } else {
          recurso.estados.add(it.estado.id);
          recurso.detalles[it.estado.id - 1] = {
            id: `R${recurso.id}E${it.estado.id}`,
            recurso_id: recurso.id,
            estado: it.estado,
            cantidad: it.cantidad,
          };
          recurso.cantidad += it.cantidad;
        }
        return acc;
      }, new Map<RECURSO, { id: number; nombre: string; estados: Set<number>; cantidad: number; detalles: RecursoDetalle[] }>())
      .values()
  ).map<IRecurso>((recurso) => {
    return {
      ...recurso,
      estados: Array.from(recurso.estados.values()).sort((a, b) => a - b),
      detalles: {
        data: recurso.detalles,
        chart: {
          data: recurso.detalles.map((it) => it.cantidad),
          backgroundColor: [
            '#22c55e',
            '#14b8a6',
            '#eab308',
            '#ef4444',
            '#6b7280',
          ],
          hoverBackgroundColor: [
            '#4ade80',
            '#2dd4bf',
            '#facc15',
            '#f87171',
            '#9ca3af',
          ],
        },
      },
    };
  });

  protected recurso_primeicon_map = recurso_primeicon_map;

  /* .............................. ciclo de vida ............................. */

  ngOnInit(): void {
    this.recursos.slice(0, 3).forEach(
      (recurso) =>
        this.expandedRows[recurso.id] = true
    );
  }

  /* ................................. events ................................. */

  on_recurso_edit_done(detalle: RecursoDetalle) {
    this.api.client.recursos.actualizar_recurso_de_un_espacio_academico
      .mutate({
        espacio_academico: this.espacio_academico.id,
        recurso: detalle.recurso_id,
        cantidad: detalle.cantidad,
        estado: detalle.estado.id,
      })
      .then(() => {
        this.detalles_clonados.delete(detalle.id);
        this.toast.add({
          summary: 'Recursos actualizados con exito',
          severity: 'success',
        });
      })
      .catch(() => {
        this.on_recurso_edit_cancel(detalle);
      });
  }

  on_recurso_edit_cancel(detalle: RecursoDetalle) {
    const prev = this.detalles_clonados.get(detalle.id)!;

    const index = this.recursos.findIndex((r) => r.id === detalle.recurso_id);

    this.recursos[index].detalles.data[detalle.estado.id - 1] = prev;

    this.detalles_clonados.delete(detalle.id);
  }

  on_recurso_edit_init(detalle: RecursoDetalle) {
    this.detalles_clonados.set(detalle.id, clone_object(detalle));
  }

  on_recursos_anadidos(recurso_del_espacio: RecursoDeUnEspacioAcademico) {
    this.toast.add({
      summary: 'Recursos añadidos con exito',
      detail: `${recurso_del_espacio.cantidad} ${
        RECURSOS[recurso_del_espacio.recurso - 1].nombre
      } han sido añadidos(a) a este espacio académico`,
      severity: 'success',
    });

    // TODO: recargar datos
  }
}
