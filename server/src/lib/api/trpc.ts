import { initTRPC } from '@trpc/server';
import { TRPCContext } from './context';
import superjson from 'superjson';
import { SwaiError, SwaiErrorCode } from '@swai/core';
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
        swai_error,
      },
    };
  },
});

export const createTRPCRouter = trpc.router;
