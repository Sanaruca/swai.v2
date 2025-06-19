import { Component, inject, input, OnDestroy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../../../../services/api.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { NIVEL_ACADEMICO_CARDINAL_MAP, NumberCondicion, ProfesorDTO, StringCondicion, TIPO_DE_EMPLEADO } from '@swai/core';
import { Paginated } from '@swai/server';
import { Avatar } from 'primeng/avatar';
import { Skeleton } from 'primeng/skeleton';
import { NombrePipe } from '../../../../../../common/pipes/nombre.pipe';
import { Subscription } from 'rxjs';
import { IllustrationComponent } from '../../../../../../common/components';

@Component({
  selector: 'aw-modal-cambiar-docente-guia',
  imports: [
    CommonModule,
    InputTextModule,
    IconFieldModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    Tag,
    Avatar,
    NombrePipe,
    Skeleton,
    IllustrationComponent
  ],
  templateUrl: './cambiar_docente_guia.modal.component.html',
  styleUrl: './cambiar_docente_guia.modal.component.sass',
})
export class CambiarDocenteGuiaModalComponent implements OnDestroy {
  /* ............................... injectables .............................. */

  private api = inject(ApiService);

  /* ................................. inputs ................................. */

  seccion = input.required<string>();
  close_on_success = input(false);

  /* ................................. outputs ................................ */

  protected success = output<ProfesorDTO>();

  /* .................................. state ................................. */

  protected visible = false;

  protected loadings = {
    data: false,
    save: false,
  };

  protected docentes: ProfesorDTO[] = [];

  protected busqueda = new FormControl('')
  protected selection = new FormGroup({
    docente: new FormControl<ProfesorDTO | null>(null, [Validators.required])
  })

  /* ............................... constantes ............................... */

  protected NIVEL_ACADEMICO_CARDINAL_MAP = NIVEL_ACADEMICO_CARDINAL_MAP

  /* ................................. metodos ................................ */

  open() {
    this.visible = true;
    this.load_data().then(
      () => {
        this.subs.busqueda = this.busqueda.valueChanges.subscribe(
          (busqueda) => {
            this.loadings.data = true;
            this.selection.patchValue({ docente: null });
            this.api.client.empleados.obtener_empleados
              .query({
                por_nombre: busqueda || undefined,
                filtros: [
                  {
                    campo: 'tipo_de_empleado',
                    condicion: StringCondicion.IGUAL,
                    valor: TIPO_DE_EMPLEADO.DOCENTE,
                  },
                ]
              })
              .then(({ data }) => (this.docentes = data as ProfesorDTO[]))
              .finally(() => (this.loadings.data = false));
          }
        )
      }
    );
  }

  close() {
    this.visible = false;
    this.subs.busqueda?.unsubscribe();
    this.subs.busqueda = null;
    this.selection.reset();
    this.busqueda.reset('');
  }

  protected async save(){

    this.loadings.save = true;

    try{
      const profesor = await this.api.client.empleados.actualizar_empelado.mutate({
        cedula: this.selection.value.docente!.cedula,
        datos: {
          seccion_guia: this.seccion() as `${number}${string}`
        }
      }) as ProfesorDTO;
      this.success.emit(profesor);
      
      if (this.close_on_success()) {
        this.close();
      }
    } finally {
      this.loadings.save = false
    }
  }

  ngOnDestroy(): void {
    this.close();
  }

  /* ................................. private ................................ */

  private subs: Record<'busqueda', Subscription | null> = {
    busqueda: null
  };
  

  private async load_data() {
    this.loadings.data = true;

    try {
      const docentes = (await this.api.client.empleados.obtener_empleados.query(
        {
          filtros: [
            {
              campo: 'tipo_de_empleado',
              condicion: NumberCondicion.IGUAL,
              valor: TIPO_DE_EMPLEADO.DOCENTE,
            },
          ],
        }
      )) as Paginated<ProfesorDTO>;

      this.docentes = docentes.data;
      return docentes;
    } finally {
      this.loadings.data = false;
    }
  }
}
