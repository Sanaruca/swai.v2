import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { FastLinkComponent, InfoCardComponent } from '../../components';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ChartData, ChartOptions } from '../../../types/chart';

@Component({
  selector: 'aw-dashboard.page',
  imports: [
    CommonModule,
    FastLinkComponent,
    InfoCardComponent,
    SelectButtonModule,
    FormsModule,
    ChartModule
  ],
  templateUrl: './dashboard.page.component.html',
  styleUrl: './dashboard.page.component.sass',
})
export class DashboardPageComponent implements OnInit {

  /* ............................... injectables .............................. */
  private platformId = inject(PLATFORM_ID)

  /* ............................... constantes ............................... */

  protected INSTITUTION_NAME = environment.INSTITUTION_NAME;

  /* .................................. state ................................. */

  protected grafica_actual = 1;

  protected graficas: { titulo: string, value: number }[] = [
    { titulo: 'Recursos', value: 0 },
    { titulo: 'Estudiantes', value: 1 },
    { titulo: 'Empleados', value: 2 },
  ];


  chartData!: ChartData
  chartOptions!: ChartOptions

  ngOnInit(): void {
    this.initChart()
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
          data: [1200, 900, 300, 550, 650, 50, 30, 120],
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
        },
      },
    }
  }
}
