export function calcular_edad(fecha_de_nacimiento: Date): number {
  const hoy = new Date();
  const nacimiento = new Date(fecha_de_nacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  // Ajustar la edad si el cumpleaños aún no ha ocurrido este año
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}
