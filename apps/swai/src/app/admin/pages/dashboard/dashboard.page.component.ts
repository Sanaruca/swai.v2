import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FastLinkComponent, InfoCardComponent } from '../../components';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ChartData, ChartOptions } from '../../../types/chart';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CantidadDeEmpleadosDTO, CantidadDeEspaciosAcademicosDTO, CantidadDeEstudiantesDTO, CantidadDeRecursosDTO, RegistroRecienteDTO } from '@swai/server';
import { TIPO_DE_EMPLEADO } from '@swai/core';
import { NombrePipe } from '../../../common/pipes/nombre.pipe';
import { TipoDeEmpleadoTagComponent } from '../../../common/components';
import { Tag } from 'primeng/tag';
import { Avatar } from 'primeng/avatar';
import { AppStateService } from '../../../services/state.service';

@Component({
  selector: 'aw-dashboard.page',
  imports: [
    CommonModule,
    FastLinkComponent,
    InfoCardComponent,
    SelectButtonModule,
    FormsModule,
    ChartModule,
    NombrePipe,
    TipoDeEmpleadoTagComponent,
    Tag,
    Avatar,
    RouterLink
  ],
  templateUrl: './dashboard.page.component.html',
  styleUrl: './dashboard.page.component.sass',
})
export class DashboardPageComponent implements OnInit {

  /* ............................... injectables .............................. */
  private platformId = inject(PLATFORM_ID)
  private route = inject(ActivatedRoute)
  private app = inject(AppStateService)

  /* ............................... constantes ............................... */

  protected INSTITUTION_NAME = this.app.institucion.nombre;
  protected TIPO_DE_EMPLEADO = TIPO_DE_EMPLEADO;

  /* .............................. data inicial .............................. */
  protected registros_recientes = this.route.snapshot.data['registros_recientes'] as RegistroRecienteDTO[]
  protected cantidad_de_estudiantes = this.route.snapshot.data['cantidad_de_estudiantes'] as CantidadDeEstudiantesDTO
  protected cantidad_de_empleados = this.route.snapshot.data['cantidad_de_empleados'] as CantidadDeEmpleadosDTO
  protected cantidad_de_espacios_academicos = this.route.snapshot.data['cantidad_de_espacios_academicos'] as CantidadDeEspaciosAcademicosDTO
  protected cantidad_de_recursos = this.route.snapshot.data['cantidad_de_recursos'] as CantidadDeRecursosDTO

  /* .................................. state ................................. */

  protected grafica_actual = 1;

  protected graficas: { titulo: string, value: number, disabled: boolean }[] = [
    { titulo: 'Recursos', value: 0, disabled: true },
    { titulo: 'Estudiantes', value: 1, disabled: false },
    { titulo: 'Empleados', value: 2, disabled: true },
  ];


  chartData!: ChartData
  chartOptions!: ChartOptions

  ngOnInit(): void {

    this.initChart()

    if (isPlatformBrowser(this.platformId)) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => this.initChart();
      mediaQuery.addEventListener('change', listener);
    }
  }


  private initChart(): void {
    // Only access document in browser environment for SSR compatibility
    let documentStyle: CSSStyleDeclaration | null = null
    let isDarkMode = false

    if (isPlatformBrowser(this.platformId)) {
      documentStyle = getComputedStyle(document.documentElement)
      isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    this.chartData = {
      labels: [
        "Total",
        "Activos",
        "No inscritos",
        "Masculino",
        "Femenino",
        "Discapacitados",
        "En gestación",
        "Repitientes",
      ],
      datasets: [
        {
          label: "Estudiantes",
          data: [
            this.cantidad_de_estudiantes.total,
            this.cantidad_de_estudiantes.activos,
            this.cantidad_de_estudiantes.no_inscritos,
            this.cantidad_de_estudiantes.masculino,
            this.cantidad_de_estudiantes.femenino,
            this.cantidad_de_estudiantes.discapacitados,
            this.cantidad_de_estudiantes.en_gestacion,
            this.cantidad_de_estudiantes.repitientes,
          ],
          backgroundColor: [
            "#1e293b", // Total
            "#22c55e", // Activos
            "#eab308", // No inscritos
            "#3b82f6", // Masculino
            "#ec4899", // Femenino
            "#67e8f9", // Discapacitados
            "#f472b6", // En gestación
            "#6b7280", // Repitientes
          ],
          borderRadius: 4,
        },
      ],
    }

    this.chartOptions = {
      locale: 'es-VE',
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color:
              isPlatformBrowser(this.platformId) && documentStyle
                ? isDarkMode
                  ? documentStyle.getPropertyValue("--p-surface-800")
                  : documentStyle.getPropertyValue("--p-surface-200")
                : "#e5e7eb",
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks:{
            display: false // Hides only the labels of the x-axis 
        }        
        },
      },
    }
  }
}
