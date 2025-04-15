import { SwaiError, SwaiErrorCode } from '@swai/core';
import { trpc } from '../trpc';

export const auth_procedure = trpc.procedure.use(({ctx, next})=> {
    // if (!ctx.sesssion.usuario) throw new SwaiError({
    //     codigo: SwaiErrorCode.AUTENTICACION_USUARIO_NO_AUTENTICADO,
    //     mensaje: 'Usuario no se a autenticado'
    // })
    return next()
});
