import { createTRPCRouter } from "../../trpc";
import { asignar_estudiantes } from "./usecase/command/asignar_estudiantes.usecase";

export const SECCIONES_ROTER = createTRPCRouter({
    asignar_estudiantes
})