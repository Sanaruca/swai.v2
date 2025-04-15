import { TRPCError } from '@trpc/server';
import { ISwaiError, SwaiError, SwaiErrorCode } from '@swai/core';
import { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';

/**
 * Mapper para convertir errores de Swai en errores de tRPC.
 */
export class SwaiToTrpcErrorMapper {
  /**
   * Mapea un error de Swai a un error de tRPC.
   * @param swaiError El error de Swai que se desea mapear.
   * @returns Una instancia de TRPCError.
   */
  public static map(swaiError: SwaiError | ISwaiError): TRPCError {
    let trpcErrorCode: TRPC_ERROR_CODE_KEY;

    // Mapear los códigos de error de SwaiError a los códigos de tRPC
    switch (swaiError.codigo) {
      case SwaiErrorCode.AUTENTICACION_CREDENCIALES_INVALIDAS:
        trpcErrorCode = 'UNAUTHORIZED';
        break;
      case SwaiErrorCode.AUTENTICACION_TOKEN_EXPIRADO:
        trpcErrorCode = 'UNAUTHORIZED';
        break;
      case SwaiErrorCode.AUTENTICACION_PERMISO_DENEGADO:
        trpcErrorCode = 'UNAUTHORIZED';
        break;
      case SwaiErrorCode.AUTENTICACION_USUARIO_NO_ENCONTRADO:
        trpcErrorCode = 'UNAUTHORIZED';
        break;
      case SwaiErrorCode.VALIDACION:
      case SwaiErrorCode.VALIDACION_CAMPO_REQUERIDO:
      case SwaiErrorCode.VALIDACION_FORMATO_INVALIDO:
      case SwaiErrorCode.VALIDACION_VALOR_FUERA_DE_RANGO:
      case SwaiErrorCode.VALIDACION_ENTRADA_DUPLICADA:
        trpcErrorCode = 'BAD_REQUEST';
        break;
      case SwaiErrorCode.RECURSO_NO_ENCONTRADO:
        trpcErrorCode = 'NOT_FOUND';
        break;
      case SwaiErrorCode.RECURSO_CONFLICTO:
        trpcErrorCode = 'CONFLICT';
        break;
      case SwaiErrorCode.RECURSO_BLOQUEADO:
        trpcErrorCode = 'FORBIDDEN';
        break;
      case SwaiErrorCode.RECURSO_LIMITE_EXCEDIDO:
        trpcErrorCode = 'FORBIDDEN';
        break;
      case SwaiErrorCode.RED_TIEMPO_DE_ESPERA_EXCEDIDO:
        trpcErrorCode = 'TIMEOUT';
        break;
      case SwaiErrorCode.RED_NO_DISPONIBLE:
        trpcErrorCode = 'INTERNAL_SERVER_ERROR';
        break;
      case SwaiErrorCode.RED_ERROR_DEL_SERVIDOR:
        trpcErrorCode = 'INTERNAL_SERVER_ERROR';
        break;
      case SwaiErrorCode.SISTEMA_ERROR_INTERNO:
      case SwaiErrorCode.ERROR_INTERNO:
        trpcErrorCode = 'INTERNAL_SERVER_ERROR';
        break;
      case SwaiErrorCode.SISTEMA_FALLO_EN_DEPENDENCIA:
        trpcErrorCode = 'INTERNAL_SERVER_ERROR';
        break;
      case SwaiErrorCode.SISTEMA_EN_MANTENIMIENTO:
        trpcErrorCode = 'INTERNAL_SERVER_ERROR';
        break;
      case SwaiErrorCode.ENTRADA_SALIDA_ARCHIVO_NO_ENCONTRADO:
        trpcErrorCode = 'NOT_FOUND';
        break;
      case SwaiErrorCode.ENTRADA_SALIDA_ERROR_DE_LECTURA:
      case SwaiErrorCode.ENTRADA_SALIDA_ERROR_DE_ESCRITURA:
        trpcErrorCode = 'INTERNAL_SERVER_ERROR';
        break;
      case SwaiErrorCode.NEGOCIO_REGLA_VIOLADA:
        trpcErrorCode = 'PRECONDITION_FAILED';
        break;
      case SwaiErrorCode.NEGOCIO_OPERACION_NO_PERMITIDA:
        trpcErrorCode = 'FORBIDDEN';
        break;
      case SwaiErrorCode.NEGOCIO_DEPENDENCIA_FALTANTE:
        trpcErrorCode = 'BAD_REQUEST';
        break;
      default:
        trpcErrorCode = 'INTERNAL_SERVER_ERROR';
        break;
    }

    // Crear y devolver una instancia de TRPCError
    return new TRPCError({
      code: trpcErrorCode,
      message: swaiError.mensaje, // Mantener el mensaje original de SwaiError
      cause: swaiError.descripcion,
    });
  }
}
