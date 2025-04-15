import { SwaiError, SwaiErrorCode } from 'core/src/common';

export const EstudianteNoExisteError = new SwaiError({
  codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
  mensaje: 'Estudiante no existe',
});

export * from './EstudianteRegistradoError.error';
