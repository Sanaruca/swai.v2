import { Component, inject, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AreaDeFromacion,
  NIVEL_ACADEMICO_CARDINAL_MAP,
  NivelAcademico as CoreNivelAcademico,
  Seccion as CoreSeccion,
  get_next_section_value,
  PensumDTO,
  NIVELES_ACADEMICOS_MAP,
} from '@swai/core';
import { InfoCardComponent } from '../../../../components';
import { obtener_color_seccion_class } from '../../utils';
import { Tag } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { ApiService } from '../../../../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SkeletonModule } from 'primeng/skeleton';

// TODO: refactorizar el template para que sea más sencillo entender

interface NivelAcademicoConPensumDTO extends CoreNivelAcademico {
  pensum: Array<AreaDeFromacion & { horas: number }>;
}

interface Seccion extends CoreSeccion {
  cantidad_de_estudiantes: {
    activos: number;
    no_inscritos: number;
    retirados: number;
    total: number;
  };

}

export interface NivelAcademico extends NivelAcademicoConPensumDTO {
  secciones: Array<
    Seccion
  >;

  cantidad_de_estudiantes: {
    activos: number;
    no_inscritos: number;
    retirados: number;
    total: number;
  };
}

@Component({
  selector: 'aw-editable-nivel-academico',
  imports: [
    CommonModule,
    InfoCardComponent,
    Tag,
    RouterLink,
    ButtonModule,
    Divider,
    TooltipModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    SkeletonModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './editable_nivel_academico.component.html',
  styleUrl: './editable_nivel_academico.component.scss',
})
export class EditableNivelAcademicoComponent implements OnInit {
  /* ............................... injectables .............................. */

  private toast = inject(MessageService);
  private api = inject(ApiService);
  private confirmationService = inject(ConfirmationService);

  /* ................................. inputs ................................. */
  nivel_academico = input.required<number>();

  /* ................................. outputs ................................ */

  changes_success = output<void>();

  /* ................................ constants ............................... */
  protected NIVEL_ACADEMICO_CARDINAL_MAP = NIVEL_ACADEMICO_CARDINAL_MAP;
  protected NIVELES_ACADEMICOS_MAP = NIVELES_ACADEMICOS_MAP;

  /* .................................. state ................................. */

  protected nivel_academico_data: NivelAcademico | null = null;
  protected secciones_editables: Array<Seccion & {aux: {existe: boolean, add: boolean }}> = [];

  get puede_aplicar_cambios() {
    return this.secciones_adicionales.length > 0 || this.secciones_editables.some(seccion => seccion.aux.add);
  }
  get_secciones_editables(): Array<Seccion & {aux: {existe: boolean, add: boolean}}>{
    const secciones = this.short_secciones(this.nivel_academico_data?.secciones ?? []);

    /**
   * Convierte un valor de letras a su número equivalente en base 26.
   * Ejemplo: "A" → 1, "Z" → 26, "AA" → 27.
   * 
   * @param {string} value - Cadena en formato alfabético
   * @returns {number} - Valor numérico correspondiente en base 26
   */
  const toNumber = (value: string): number =>
    [...value].reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 'A'.charCodeAt(0) + 1), 0);

  /**
   * Convierte un número en base 26 a su representación en letras.
   * Ejemplo: 27 → "AA", 28 → "AB".
   * 
   * @param {number} num - Número en base 26
   * @returns {string} - Cadena en formato alfabético
   */
  const toLetters = (num: number): string => {
    let result = "";
    while (num > 0) {
      const remainder = (num - 1) % 26;
      result = String.fromCharCode(remainder + 'A'.charCodeAt(0)) + result;
      num = Math.floor((num - 1) / 26);
    }
    return result;
  };

  // Definir el rango a completar
  const start = toNumber(secciones[0].seccion);
  const end = toNumber(secciones[secciones.length - 1].seccion);

  // Generar los valores faltantes en el rango
  const secciones_editables: Array<Seccion & {aux: {existe: boolean, add: boolean}}> = [];
  // Crear un conjunto para verificar existencia de valores originales
  const originalSet = new Set(secciones.map((s) => s.seccion));

  // Generar los valores faltantes en el rango y marcar existencia
  for (let i = start; i <= end; i++) {
    const seccionValue = toLetters(i);
    const existe = originalSet.has(seccionValue);

    // Si el valor original existe, obtener la referencia completa, si no, crear uno vacío con aux.existe = false
    const seccion = existe ? secciones.find(s => s.seccion === seccionValue)! : {
      id: `${this.nivel_academico()}${seccionValue}`,
      seccion: seccionValue,
       nivel_academico: this.nivel_academico(),
        profesor_guia: null,
        cantidad_de_estudiantes: {
          activos: 0,
          no_inscritos: 0,
          retirados: 0,
          total: 0,
        },
      } as Seccion;


    secciones_editables.push({ ...seccion, aux: { existe, add: false } });
  }




  return secciones_editables;
  } 

  protected editing = false;
  protected loading = false;

  protected secciones_adicionales: Array<Seccion> = [];

  /* ................................. metodos ................................ */

  toggle_editing(event: Event) {
    console.log(event.target);

    if (this.editing && this.secciones_adicionales.length) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Seguro que desea descartar los cambios?',
        icon: 'pi pi-exclamation-triangle',
        key: 'toggle_editing',
        rejectButtonProps: {
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Aceptar',
        },
        accept: () => {
          this.cancelar();
        },
      });
    } else {
      this.editing = !this.editing;
    }
  }

  protected add_seccion() {
    const secciones = this.short_secciones(this.all_secciones);

    const last_seccion = secciones[secciones.length - 1];

    const last_seccion_value = last_seccion?.seccion?.toUpperCase() || 'A';
    const next_seccion_value = get_next_section_value(last_seccion_value);

    this.secciones_adicionales = [
      ...this.secciones_adicionales,
      {
        id: `${this.nivel_academico()}${next_seccion_value}`,
        seccion: next_seccion_value,
        nivel_academico: this.nivel_academico(),
        profesor_guia: null,
        cantidad_de_estudiantes: {
          activos: 0,
          no_inscritos: 0,
          retirados: 0,
          total: 0,
        },
      },
    ];
  }

  eliminar_seccion(seccion: NivelAcademico['secciones'][0], event: Event) {
    const index = this.secciones_adicionales.findIndex(
      (it) => it.id === seccion.id
    );
    if (index > -1) {
      this.secciones_adicionales.splice(index, 1);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if ('aux' in seccion && !seccion.aux.existe) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      seccion.aux.add = false;
      return;
    };

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Seguro que desea eliminar la sección académica "${seccion.id}"?`,
      header: 'Eliminar sección académica',
      icon: 'pi pi-info-circle',
      key: 'confirm_delete',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },

      accept: () => {
        this.loading = true;
        this.api.client.secciones_academicas.eliminar_seccion_academica
          .mutate(seccion.id)
          .then(() => {

            const secciones_para_añadir = this.secciones_editables.filter((seccion) => !seccion.aux.existe && seccion.aux.add);

            this.secciones_editables = this.secciones_editables.filter((it) => it.id !== seccion.id);

            this.load_data().then(()=> {
              secciones_para_añadir.forEach((seccion) => {
                const index = this.secciones_editables.findIndex((it) => it.id === seccion.id)
                if (index > -1) {
                  this.secciones_editables[index].aux.add = true
                }
              })
            });
            this.toast.add({
              severity: 'success',
              summary: 'Seccion Eliminada',
              detail: 'Seccion acacemica ha sido eliminada',
            });
          })
          .finally(() => (this.loading = false));
      },
    });
  }

  cancelar() {
    this.secciones_adicionales = [];
    this.secciones_editables = this.secciones_editables.map((seccion) => ({ ...seccion, aux: { ...seccion.aux, add: false } }));
    this.editing = false;
  }

  protected aplicar_cambios() {
    this.loading = true;

    const secciones_adicionales = [...this.secciones_adicionales, ...this.secciones_editables.filter((seccion) => !seccion.aux.existe && seccion.aux.add)] as Seccion[];

    Promise.all(
      secciones_adicionales.map((seccion) =>
        this.api.client.niveles_academicos.añadir_seccion_academica.mutate({
          nivel_academico: this.nivel_academico(),
          seccion: seccion.seccion,
        })
      )
    )
      .then(() => {
        this.toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Secciones añadidas',
        });
        this.changes_success.emit();
        this.secciones_adicionales = [];
        this.editing = false;
        setTimeout(() => this.load_data(), 100)
      })
      .finally(() => (this.loading = false));
  }

  /* .............................. ciclo de vida ............................. */

  ngOnInit(): void {
    this.load_data();
  }

  /* ................................. helpers ................................ */

  protected obtener_color_seccion_class(seccion: string, contraste = false) {
    return obtener_color_seccion_class(seccion, contraste);
  }

  protected short_secciones(
    secciones: NivelAcademico['secciones'],
  ) {

      const copy = JSON.parse(JSON.stringify(secciones)) as NivelAcademico['secciones'];

      return copy.sort((a, b) => {
        // Función para convertir un valor en letras a número en base 26
        const toNumber = (value: string): number => {
          return [...value].reduce(
            (acc, char) =>
              acc * 26 + (char.charCodeAt(0) - 'A'.charCodeAt(0) + 1),
            0
          );
        };

        return toNumber(a.seccion) - toNumber(b.seccion); // Orden ascendente
      });

  }

  protected get all_secciones() {
    return [
      ...(this.nivel_academico_data?.secciones ?? []),
      ...this.secciones_adicionales,
    ];
  }

  private async load_data() {
    this.loading = true;

    try {
      const [pensum, cantidad_de_estudiantes] = await Promise.all([
        this.api.client.institucion.obtener_pensum.query({
          nivel_academico: this.nivel_academico(),
        }) as Promise<PensumDTO>,
        this.api.client.institucion.obtener_cantidad_de_estudiantes.query(),
      ]);

      const nivel_academico = pensum.nivel_academico;

      const secciones = cantidad_de_estudiantes.niveles_academicos
        .find((it) => it.numero === nivel_academico.numero)
        ?.secciones.map((it) => ({
          id: it.id,
          seccion: it.seccion,
          nivel_academico: it.nivel_academico,
          cantidad_de_estudiantes: {
            activos: it.activos,
            no_inscritos: it.no_inscritos,
            retirados: it.retirados,
            total: it.total,
          },
        }));

      this.nivel_academico_data = {
        ...nivel_academico,
        cantidad_de_estudiantes: {
          activos: cantidad_de_estudiantes?.activos ?? 0,
          no_inscritos: cantidad_de_estudiantes?.no_inscritos ?? 0,
          retirados: cantidad_de_estudiantes?.retirados ?? 0,
          total: cantidad_de_estudiantes?.total ?? 0,
        },
        secciones: secciones ?? [],
        pensum: pensum.areas_de_formacion,
      };

      this.secciones_editables = this.get_secciones_editables();
    } finally {
      this.loading = false;
    }
  }

}
