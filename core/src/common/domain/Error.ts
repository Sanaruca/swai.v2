/**
 * Enum que contiene los códigos de error utilizados en la aplicación.
 * Cada código representa un tipo específico de error que puede ocurrir.
 */
export enum SwaiErrorCode {
  // Errores de autenticación y autorización

  /**
   * Las credenciales proporcionadas son inválidas.
   */
  AUTENTICACION_CREDENCIALES_INVALIDAS = 'AUTENTICACION_CREDENCIALES_INVALIDAS',

  /**
   * El token de autenticación ha expirado.
   */
  AUTENTICACION_TOKEN_EXPIRADO = 'AUTENTICACION_TOKEN_EXPIRADO',

  /**
   * El usuario no tiene permisos para realizar esta acción.
   */
  AUTENTICACION_PERMISO_DENEGADO = 'AUTENTICACION_PERMISO_DENEGADO',

  /**
   * El usuario no existe en el sistema.
   */
  AUTENTICACION_USUARIO_NO_ENCONTRADO = 'AUTENTICACION_USUARIO_NO_ENCONTRADO',
  /**
   * 
   * El usuario no autenticado.
   */
  AUTENTICACION_USUARIO_NO_AUTENTICADO = 'AUTENTICACION_USUARIO_NO_AUTENTICADO',

  // Errores de validación

  /**
   * Error de validación.
   */
  VALIDACION = 'VALIDACION',

  /**
   * Falta un campo obligatorio en la solicitud.
   */
  VALIDACION_CAMPO_REQUERIDO = 'VALIDACION_CAMPO_REQUERIDO',

  /**
   * El formato de un campo no es válido (por ejemplo, un correo electrónico mal formado).
   */
  VALIDACION_FORMATO_INVALIDO = 'VALIDACION_FORMATO_INVALIDO',

  /**
   * Un valor está fuera del rango permitido.
   */
  VALIDACION_VALOR_FUERA_DE_RANGO = 'VALIDACION_VALOR_FUERA_DE_RANGO',

  /**
   * Se intentó crear un recurso que ya existe.
   */
  VALIDACION_ENTRADA_DUPLICADA = 'VALIDACION_ENTRADA_DUPLICADA',

  // Errores de recursos

  /**
   * El recurso solicitado no existe.
   */
  RECURSO_NO_ENCONTRADO = 'RECURSO_NO_ENCONTRADO',

  /**
   * Conflicto al intentar modificar o crear un recurso (por ejemplo, un ID duplicado).
   */
  RECURSO_CONFLICTO = 'RECURSO_CONFLICTO',

  /**
   * El recurso está bloqueado y no se puede modificar.
   */
  RECURSO_BLOQUEADO = 'RECURSO_BLOQUEADO',

  /**
   * Se ha alcanzado el límite de recursos permitidos.
   */
  RECURSO_LIMITE_EXCEDIDO = 'RECURSO_LIMITE_EXCEDIDO',

  // Errores de red o conectividad

  /**
   * La solicitud ha excedido el tiempo de espera.
   */
  RED_TIEMPO_DE_ESPERA_EXCEDIDO = 'RED_TIEMPO_DE_ESPERA_EXCEDIDO',

  /**
   * No hay conexión a la red.
   */
  RED_NO_DISPONIBLE = 'RED_NO_DISPONIBLE',

  /**
   * Error en el servidor al procesar la solicitud.
   */
  RED_ERROR_DEL_SERVIDOR = 'RED_ERROR_DEL_SERVIDOR',

  // Errores del sistema

  /**
   * Error interno del sistema.
   */
  SISTEMA_ERROR_INTERNO = 'SISTEMA_ERROR_INTERNO',

  /**
   * Alias para el código de error `SISTEMA_ERROR_INTERNO`.
   */
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  ERROR_INTERNO = 'SISTEMA_ERROR_INTERNO',

  /**
   * Fallo en una dependencia externa (por ejemplo, una API de terceros).
   */
  SISTEMA_FALLO_EN_DEPENDENCIA = 'SISTEMA_FALLO_EN_DEPENDENCIA',

  /**
   * El sistema está en mantenimiento y no puede procesar solicitudes.
   */
  SISTEMA_EN_MANTENIMIENTO = 'SISTEMA_EN_MANTENIMIENTO',

  // Errores de entrada/salida

  /**
   * El archivo solicitado no existe.
   */
  ENTRADA_SALIDA_ARCHIVO_NO_ENCONTRADO = 'ENTRADA_SALIDA_ARCHIVO_NO_ENCONTRADO',

  /**
   * Error al leer un archivo.
   */
  ENTRADA_SALIDA_ERROR_DE_LECTURA = 'ENTRADA_SALIDA_ERROR_DE_LECTURA',

  /**
   * Error al escribir en un archivo.
   */
  ENTRADA_SALIDA_ERROR_DE_ESCRITURA = 'ENTRADA_SALIDA_ERROR_DE_ESCRITURA',

  // Errores de negocio (dominio específico)

  /**
   * Se violó una regla de negocio específica.
   */
  NEGOCIO_REGLA_VIOLADA = 'NEGOCIO_REGLA_VIOLADA',

  /**
   * La operación solicitada no está permitida en este contexto.
   */
  NEGOCIO_OPERACION_NO_PERMITIDA = 'NEGOCIO_OPERACION_NO_PERMITIDA',

  /**
   * Falta una dependencia necesaria para completar la operación.
   */
  NEGOCIO_DEPENDENCIA_FALTANTE = 'NEGOCIO_DEPENDENCIA_FALTANTE',

  // Errores personalizados
}

export interface ISwaiError {
  /**
   * Código único para identificar el error
   */
  codigo: SwaiErrorCode;
  /**
   * Resumen del error
   */
  mensaje: string;
  /**
   * Descripción opcional del error
   */
  descripcion?: string;
  /**
   * Fecha y hora en que ocurrió el error
   */
  fecha: Date;
  /**
   * Información adicional opcional
   */
  metadata?: Record<string, any>;
}

export class SwaiError extends Error implements Readonly<ISwaiError> {
  readonly codigo: SwaiErrorCode;
  readonly mensaje: string;
  readonly descripcion?: string | undefined;
  readonly fecha: Date = new Date();
  readonly metadata?: Record<string, any> | undefined;

  constructor(error: {
    codigo: SwaiErrorCode;
    mensaje: string;
    descripcion?: string;
    metadata?: Record<string, any>;
  }) {
    super(error.mensaje);
    this.name = 'SwaiError';
    this.codigo = error.codigo;
    this.mensaje = error.mensaje;
    this.descripcion = error.descripcion;
    this.metadata = error.metadata;

    // Mantener el stack trace correcto (solo en entornos compatibles)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SwaiError);
    }
  }

  /**
   * Convierte el error a un objeto JSON.
   * @returns Un objeto que representa el error.
   */
  public toJSON(): ISwaiError {
    return {
      codigo: this.codigo,
      mensaje: this.mensaje,
      descripcion: this.descripcion,
      fecha: this.fecha,
      metadata: this.metadata,
    };
  }
}
