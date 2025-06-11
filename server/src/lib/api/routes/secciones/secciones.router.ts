import { createTRPCRouter } from "../../trpc";
import { eliminar_seccion_academica } from "./usecase/command/eliminar_seccion_academica.usecase";
import { asignar_estudiantes } from "./usecase/command/asignar_estudiantes.usecase";

export const SECCIONES_ROTER = createTRPCRouter({
    asignar_estudiantes,
    eliminar_seccion_academica
})