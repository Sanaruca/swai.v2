import { ROL, SwaiError, SwaiErrorCode } from '@swai/core';
import { auth_procedure } from './auth.procedure';

export const admin_procedure = auth_procedure.use(({ctx, next})=> {
    if (ctx.sesssion.usuario && ctx.sesssion.usuario.rol !== ROL.ADMIN) throw new SwaiError({
        codigo: SwaiErrorCode.AUTENTICACION_PERMISO_DENEGADO,
        mensaje: 'Usuario no posee permisos para este procedimiento'
    })
    return next()
});
