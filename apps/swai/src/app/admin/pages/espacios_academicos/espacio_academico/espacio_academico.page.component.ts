import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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

 function clone_object<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}


interface RecursoDetalle {
  id: string;
  recurso_id: number;
  estado: EstadoDeUnRecurso;
  cantidad: number;
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
  ],
  templateUrl: './espacio_academico.page.component.html',
  styleUrl: './espacio_academico.page.component.scss',
})
export class EspacioAcademicoPageComponent {
  /* ............................... injectables .............................. */
  private router = inject(Router);
  private toast = inject(MessageService);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  /* .................................. state ................................. */
  expandedRows = {};
  data!: object;
  platformId = inject(PLATFORM_ID);

  options = {
    cutout: '60%',
  };

  protected detalles_clonados: Map<string, RecursoDetalle> = new Map();

  /* .................................. menu .................................. */
  protected menu_options = [
    {
      label: 'Opciones',
      items: [
        {
          label: 'Editar Espacio',
          icon: 'pi pi-pencil',
          command: () => null,
        },
        {
          label: 'Eliminar Espacio',
          icon: 'pi pi-trash',
          command: () => null,
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

  protected resumen_cantidad_de_recursos = ((component) => ({
    estados: ESTADOS_DE_UN_RECURSO.map((estado) => ({
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
    })),
  }))(this);

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
  ).map((it) => ({
    ...it,
    estados: Array.from(it.estados.values()).sort((a, b) => a - b),
  }));

  protected recurso_primeicon_map = recurso_primeicon_map;

  /* .................................. inits ................................. */

  init_resumen_chart() {
    const valores = this.resumen_cantidad_de_recursos.estados.map(
      (it) => it.total
    );

    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);

      return {
        datasets: [
          {
            data: valores,
            backgroundColor: [
              documentStyle.getPropertyValue('--p-green-500'),
              documentStyle.getPropertyValue('--p-teal-500'),
              documentStyle.getPropertyValue('--p-yellow-500'),
              documentStyle.getPropertyValue('--p-red-500'),
              documentStyle.getPropertyValue('--p-gray-500'),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--p-green-400'),
              documentStyle.getPropertyValue('--p-teal-400'),
              documentStyle.getPropertyValue('--p-yellow-400'),
              documentStyle.getPropertyValue('--p-red-400'),
              documentStyle.getPropertyValue('--p-gray-400'),
            ],
          },
        ],
      };
    }

    return {
      data: valores,
    };
  }

  init_recursos_chart(recursoID: number) {
    const recurso = this.recursos.find((it) => it.id === recursoID);

    if (!recurso) return {};

    const valores = ESTADOS_DE_UN_RECURSO.map((estado) => {
      const detalle = recurso.detalles.find((it) => it.estado.id === estado.id);

      if (!detalle) return 0;

      return detalle.cantidad;
    });

    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      // const textColor = documentStyle.getPropertyValue('--p-text-color');

      return {
        datasets: [
          {
            data: valores,
            backgroundColor: [
              documentStyle.getPropertyValue('--p-green-500'),
              documentStyle.getPropertyValue('--p-teal-500'),
              documentStyle.getPropertyValue('--p-yellow-500'),
              documentStyle.getPropertyValue('--p-red-500'),
              documentStyle.getPropertyValue('--p-gray-500'),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--p-green-400'),
              documentStyle.getPropertyValue('--p-teal-400'),
              documentStyle.getPropertyValue('--p-yellow-400'),
              documentStyle.getPropertyValue('--p-red-400'),
              documentStyle.getPropertyValue('--p-gray-400'),
            ],
          },
        ],
      };
    }

    return {
      data: valores,
      // backgroundColor: [
      //   documentStyle.getPropertyValue('--p-cyan-500'),
      //   documentStyle.getPropertyValue('--p-orange-500'),
      //   documentStyle.getPropertyValue('--p-gray-500'),
      // ],
      // hoverBackgroundColor: [
      //   documentStyle.getPropertyValue('--p-cyan-400'),
      //   documentStyle.getPropertyValue('--p-orange-400'),
      //   documentStyle.getPropertyValue('--p-gray-400'),
      // ],
    };
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

    this.recursos[index].detalles[detalle.estado.id - 1] = prev;

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
