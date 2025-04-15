import { SwaiError, SwaiErrorCode } from './Error';

export class EntidadExisteError extends SwaiError {
  constructor(entidad: string) {
    super({
      codigo: SwaiErrorCode.RECURSO_CONFLICTO,
      mensaje: `${entidad} registrado(a) anteriormente`,
      descripcion: `${entidad} ya ha sido registrado(a) anteriormente en el sistema`,
    });
  }
}
