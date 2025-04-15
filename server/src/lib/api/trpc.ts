import { initTRPC, TRPCError } from '@trpc/server';
import { TRPCContext } from './context';
import superjson from 'superjson';
import { ValiError } from 'valibot';
import { SwaiError, SwaiErrorCode } from 'core/src/common/domain/Error';
import { TrpcToSwaiErrorMapper } from '../adapters/TrpcToSwaiErrorMapper.mapper';
import { TRPC_ERROR_CODES_BY_KEY, TRPCErrorShape } from '@trpc/server/rpc';
import { SwaiToTrpcErrorMapper } from '../adapters/SwaiToTrpcErrorMapper.mapper';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';

export const trpc = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }): TRPCErrorShape {
    const swai_error =
      error.cause instanceof SwaiError
        ? error.cause.toJSON()
        : new SwaiError({
            codigo: SwaiErrorCode.ERROR_INTERNO,
            mensaje: 'Error interno',
          }).toJSON();

    // TODO: No se si estas conversiones sea ideales en rendimiento
    const trpc_error = SwaiToTrpcErrorMapper.map(swai_error);

    shape.code = TRPC_ERROR_CODES_BY_KEY[trpc_error.code];
    shape.data.code = trpc_error.code;
    shape.data.httpStatus = getHTTPStatusCodeFromError(trpc_error);

    return {
      ...shape,
      data: {
        ...shape.data,
        // En teoria todos los errores son de tipo SwaiError ya que se mapearon los errores en los
        // procedures abajo
        swai_error,
      },
    };
  },
});

trpc.procedure = trpc.procedure.use(async ({ next }) => {
  try {
    const response = await next();

    if (response.ok == false && response.error.cause) {
      console.error({ error: response.error.cause });
      throw response.error.cause;
    }
    return response;
  } catch (error) {
    // TODO: Puede que para evitar la conversion de arriba, deberia mapear a errores de trpc
    if (error instanceof SwaiError) throw error;
    if (error instanceof TRPCError) throw TrpcToSwaiErrorMapper.map(error);

    if (error instanceof ValiError) {
      console.error({
        name: error.name,
        message: error.message,
        issues: error.issues,
        stack: error.stack,
      });

      throw new SwaiError({
        codigo: SwaiErrorCode.VALIDACION,
        mensaje: 'Error al validar los datos',
        metadata: {
          validErrorIssues: error.issues,
        },
      });
    }

    throw new SwaiError({
      codigo: SwaiErrorCode.ERROR_INTERNO,
      mensaje: 'Ha ocurrido un error inesperado',
    });
  }
});

export const createTRPCRouter = trpc.router;
