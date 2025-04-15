import { SwaiError, SwaiErrorCode } from '../../../common/domain/errors/Error';

export const EstudianteNoExisteError = new SwaiError({
  codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
  mensaje: 'Estudiante no existe',
});

export * from './EstudianteRegistradoError.error';
