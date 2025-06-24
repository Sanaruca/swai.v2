export enum Mes {
  ENERO = 1,
  FEBRERO,
  MARZO,
  ABRIL,
  MAYO,
  JUNIO,
  JULIO,
  AGOSTO,
  SEPTIEMBRE,
  OCTUBRE,
  NOVIEMBRE,
  DICIEMBRE,
}

export const MES_NOMBRE_MAP: Record<number, string> = {
  [Mes.ENERO]: 'Enero',
  [Mes.FEBRERO]: 'Febrero',
  [Mes.MARZO]: 'Marzo',
  [Mes.ABRIL]: 'Abril',
  [Mes.MAYO]: 'Mayo',
  [Mes.JUNIO]: 'Junio',
  [Mes.JULIO]: 'Julio',
  [Mes.AGOSTO]: 'Agosto',
  [Mes.SEPTIEMBRE]: 'Septiembre',
  [Mes.OCTUBRE]: 'Octubre',
  [Mes.NOVIEMBRE]: 'Noviembre',
  [Mes.DICIEMBRE]: 'Diciembre',
};
