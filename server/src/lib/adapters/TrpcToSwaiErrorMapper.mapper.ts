import { TRPCError } from '@trpc/server';
import { SwaiError, SwaiErrorCode } from '@swai/core';

/**
 * Mapper para convertir errores de tRPC en errores de Swai.
 */
export class TrpcToSwaiErrorMapper {
  /**
   * Mapea un error de tRPC a un error de Swai.
   * @param trpcError El error de tRPC que se desea mapear.
   * @returns Una instancia de SwaiError.
   */
  public static map(trpcError: TRPCError): SwaiError {
    let swaiErrorCode: SwaiErrorCode;
    let mensaje: string;

    // Mapear los códigos de error de tRPC a los códigos de SwaiErrorCode
    switch (trpcError.code) {
      case 'UNAUTHORIZED':
        swaiErrorCode = SwaiErrorCode.AUTENTICACION_PERMISO_DENEGADO;
        mensaje = 'No tienes permisos para realizar esta acción.';
        break;
      case 'FORBIDDEN':
        swaiErrorCode = SwaiErrorCode.AUTENTICACION_PERMISO_DENEGADO;
        mensaje = 'Acceso denegado.';
        break;
      case 'NOT_FOUND':
        swaiErrorCode = SwaiErrorCode.RECURSO_NO_ENCONTRADO;
        mensaje = 'El recurso solicitado no existe.';
        break;
      case 'BAD_REQUEST':
        swaiErrorCode = SwaiErrorCode.VALIDACION_FORMATO_INVALIDO;
        mensaje = 'La solicitud contiene datos inválidos.';
        break;
      case 'CONFLICT':
        swaiErrorCode = SwaiErrorCode.RECURSO_CONFLICTO;
        mensaje = 'Conflicto al intentar procesar la solicitud.';
        break;
      case 'INTERNAL_SERVER_ERROR':
        swaiErrorCode = SwaiErrorCode.SISTEMA_ERROR_INTERNO;
        mensaje = 'Ocurrió un error interno en el sistema.';
        break;
      case 'TIMEOUT':
        swaiErrorCode = SwaiErrorCode.RED_TIEMPO_DE_ESPERA_EXCEDIDO;
        mensaje = 'La solicitud excedió el tiempo de espera.';
        break;
      case 'PRECONDITION_FAILED':
        swaiErrorCode = SwaiErrorCode.NEGOCIO_REGLA_VIOLADA;
        mensaje = 'Se violó una regla de negocio.';
        break;
      default:
        swaiErrorCode = SwaiErrorCode.ERROR_INTERNO;
        mensaje = 'Ocurrió un error inesperado';
        break;
    }

    // Crear y devolver una instancia de SwaiError
    return new SwaiError({
      codigo: swaiErrorCode,
      mensaje: mensaje,
      descripcion: trpcError.message,
      metadata: {
        trpcCode: trpcError.code,
        originalError: trpcError,
      },
    });
  }
}
