import { ColorSeccion, SeccionColor } from '@swai/core';

export function obtener_color_seccion_class(
  seccion: string,
  contraste = false
) {
  const color_seccion = ColorSeccion.getColor(seccion);

  const bg_color = new Map<SeccionColor, string>([
    [SeccionColor.BLUE, 'bg-blue-100 dark:bg-blue-700'],
    [SeccionColor.CYAN, 'bg-cyan-100 dark:bg-cyan-700'],
    [SeccionColor.PINK, 'bg-pink-100 dark:bg-pink-700'],
    [SeccionColor.INDIGO, 'bg-indigo-100 dark:bg-indigo-700'],
    [SeccionColor.YELLOW, 'bg-yellow-100 dark:bg-yellow-700'],
    [SeccionColor.GREEN, 'bg-green-100 dark:bg-green-700'],
  ]);

  const bg_color_contrast = new Map<SeccionColor, string>([
    [SeccionColor.BLUE, 'bg-blue-200 dark:bg-blue-800'],
    [SeccionColor.CYAN, 'bg-cyan-200 dark:bg-cyan-800'],
    [SeccionColor.PINK, 'bg-pink-200 dark:bg-pink-800'],
    [SeccionColor.INDIGO, 'bg-indigo-200 dark:bg-indigo-800'],
    [SeccionColor.YELLOW, 'bg-yellow-200 dark:bg-yellow-800'],
    [SeccionColor.GREEN, 'bg-green-200 dark:bg-green-800'],
  ]);

  return contraste
    ? `${bg_color_contrast.get(color_seccion)}`
    : `${bg_color.get(color_seccion)}`;
}
