export function generate_slug(name: string): string {
  return name
    .toLowerCase() // Convertir a minúsculas
    .trim() // Eliminar espacios al inicio y al final
    .replace(/[^a-z0-9 -]/g, '') // Eliminar caracteres no alfanuméricos
    .replace(/\s+/g, '-') // Reemplazar espacios por guiones
    .replace(/-+/g, '-'); // Reemplazar múltiples guiones por uno solo
}
