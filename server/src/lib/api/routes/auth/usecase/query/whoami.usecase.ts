import { UsuarioPayload } from "@swai/core";
import { auth_procedure } from "../../../../procedures";

export const whoami = auth_procedure.query<UsuarioPayload>(({ ctx }) => {
  return ctx.sesssion.usuario;
})