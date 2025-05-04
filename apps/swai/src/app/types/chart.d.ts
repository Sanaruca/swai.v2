export interface ChartDataset {
    label: string
    data: number[]
    backgroundColor: string[]
    borderRadius: number
  }
  
  export interface ChartData {
    labels: string[]
    datasets: ChartDataset[]
  }
  
  export interface ChartScaleOptions {
    beginAtZero?: boolean
    grid?: {
      color?: string
      display?: boolean
    }
  }
  
  export interface ChartScales {
    y: ChartScaleOptions
    x: ChartScaleOptions
  }
  
  export interface ChartPlugins {
    legend: {
      display: boolean
    }
  }
  
  export interface ChartOptions {
    plugins: ChartPlugins
    scales: ChartScales
  }
  