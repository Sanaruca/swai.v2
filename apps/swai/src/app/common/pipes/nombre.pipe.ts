import { Pipe, PipeTransform } from '@angular/core';
import { Persona } from '@swai/core';

@Pipe({
  name: 'nombre',
})
export class NombrePipe implements PipeTransform {
  transform(
    persona: Persona,
    modo: 'corto' | 'iniciales' | 'completo' = 'corto'
  ): string {
    if (modo === 'iniciales')
      return persona.nombres.charAt(0) + persona.apellidos.charAt(0);
    if (modo === 'completo') return persona.nombres + ' ' + persona.apellidos;
    if (modo === 'corto')
      return (
        persona.nombres.split(' ').at(0) +
        ' ' +
        persona.apellidos.split(' ').at(0)
      ).trim();

    return '';
  }
}
