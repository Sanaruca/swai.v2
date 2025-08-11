import { SwaiError, SwaiErrorCode, Usuario, UsuarioSchema } from '@swai/core';
import { public_procedure } from '../../../../procedures';
import { InferOutput, object, parser } from 'valibot';
import { enviar_email_fn } from '../../../mail/usecase/command/enviar_email.usecase';
import { EmailRecuperarClaveTemplateVariables } from '../../../../../templates/html/email_recuperar_clave';
import * as jwt from 'jsonwebtoken';

export const RecuperarClaveSchemaDTO = object({
  correo: UsuarioSchema.entries.correo,
});

export type RecuperarClaveDTO = InferOutput<typeof RecuperarClaveSchemaDTO>;

export const recuperar_clave = public_procedure
  .input(parser(RecuperarClaveSchemaDTO))
  .mutation(async ({ ctx, input }) => {
    const usuario = await ctx.prisma.usuarios.findFirst({
      where: { correo: input.correo },
      select: {
        correo: true,
        id: true,
      },
    });

    if (!usuario) {
      throw new SwaiError({
        codigo: SwaiErrorCode.RECURSO_NO_ENCONTRADO,
        mensaje: 'Usuario no encontrado',
        descripcion:
          'No se encontro ninguna cuenta asociada al correo proporcionado',
      });
    }

    const token = generar_token_de_recuperacion_de_clave_fn(
      usuario.id,
      ctx.env.secret,
    );

    await enviar_email_fn({
      params: {
        asunto: 'Recuperación de contraseña - Liceo Miguel José Sanz',
        desde: 'SWAI <onboarding@resend.dev>',
        para: input.correo,
        template: {
          nombre: 'email_recuperar_clave',
          varialbes: {
            CORREO_USUARIO: usuario.correo,
            URL_REINICIAR_CLAVE: `${ctx.env.swai_base_url}/recuperar_cuenta?token=${token}`,
            CORREO_SOPORTE: '',
            NUMERO_TELEFONICO: '',
          } as EmailRecuperarClaveTemplateVariables,
        },
      },
    });
  });

function generar_token_de_recuperacion_de_clave_fn(
  usuario_id: Usuario['id'],
  secret: string,
): string {
  const token = jwt.sign(
    {
      usuario_id,
    },
    secret,
    {
      expiresIn: '1d',
    },
  );

  return token;
}
