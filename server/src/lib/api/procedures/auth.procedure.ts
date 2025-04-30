import { SwaiError, SwaiErrorCode, type UsuarioPayload } from '@swai/core';
import { trpc } from '../trpc';
import { TRPCContext } from '../context';

interface TRPCContextWithAuthUser extends TRPCContext {
    sesssion: {
        usuario: UsuarioPayload
    }
}

export const auth_procedure = trpc.procedure.use<TRPCContextWithAuthUser>(({ctx, next})=> {
    if (!ctx.sesssion.usuario) throw new SwaiError({
        codigo: SwaiErrorCode.AUTENTICACION_USUARIO_NO_AUTENTICADO,
        mensaje: 'Usuario no se a autenticado'
    })
    return next()
});
