export enum SeccionColor {
  BLUE = 'blue',
  CYAN = 'cyan',
  PINK = 'pink',
  INDIGO = 'indigo',
  YELLOW = 'yellow',
  GREEN = 'green',
}
const seccion_colors = Object.values(SeccionColor) as string[];

export class ColorSeccion {
  static getColor(seccion: string): SeccionColor {
    // Convertimos la letra a su posición en el abecedario (A = 1, B = 2, ..., Z = 26)
    const letterPosition =
      seccion.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;

    // Calculamos el índice en la lista de forma cíclica
    const index = (letterPosition - 1) % seccion_colors.length;

    // Retornamos el valor correspondiente de la lista
    return seccion_colors[index] as any;
  }
}
