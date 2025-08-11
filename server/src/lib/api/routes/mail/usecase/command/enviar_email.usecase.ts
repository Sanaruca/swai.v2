import * as path from 'path';
import { CreateEmailOptions, Resend } from 'resend';
import * as fs from 'fs';
import { SwaiError, SwaiErrorCode } from '@swai/core';

const resend = new Resend(process.env['SWAI_RESEND_TOKEN']);

export interface EnviarEmailFnParams {
  params: {
    desde: string;
    para: string;
    asunto: string;
    mensaje?: string;
    template?: {
      tipo?: 'html';
      nombre: string;
      varialbes?: { [key: string]: any };
    };
  };
  deps?: {
    templates_location: string;
  };
}

export async function enviar_email_fn({ params, deps }: EnviarEmailFnParams) {
  if (!params.mensaje && !params.template)
    throw new Error('Debe proporcionar un mensaje o una plantilla');

  const templates_location =
    deps?.templates_location ||
    path.join(process.cwd(), 'server/src/lib/templates');

  const resend_payload = {
    from: params.desde,
    to: [params.para],
    subject: params.asunto,
  } as CreateEmailOptions;

  if (params.template) {
    const tipo = params.template.tipo ?? 'html';
    const template_path_0 = path.join(
      templates_location,
      tipo,
      `${params.template.nombre}.template.${tipo}`,
    );
    const template_path_1 = path.join(
      templates_location,
      tipo,
      params.template.nombre,
      `${params.template.nombre}.template.${tipo}`,
    );

    let template_path: string;
    try {
      template_path = require.resolve(template_path_0);
    } catch (error) {
      try {
        template_path = require.resolve(template_path_1);
      } catch (error) {
        throw new Error(
          `No se ha encontrado la plantilla ${params.template.nombre} en ${templates_location}/${tipo}`,
        );
      }
    }

    let template = fs.readFileSync(template_path, 'utf-8');

    if (params.template.varialbes) {
      // Replace all variables
      Object.entries(params.template.varialbes).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, value || '');
      });
    }

    resend_payload.html = template;
  }

  const { error } = await resend.emails.send(resend_payload);

  if (error)
    throw new SwaiError({
      codigo: SwaiErrorCode.ERROR_INTERNO,
      mensaje: 'Ocurrio un error al tratar de enviar un correo electronico',
    });
}
