import { createTRPCRouter } from "../../trpc";
import { promover_estudiantes } from "./usecase/command/promover_estudiantes.usecase";
import { añadir_seccion_academica } from "./usecase/command/añadir_seccion_academica.usecase";

export const NIVELES_ACADEMICOS_ROUTER = createTRPCRouter({
    añadir_seccion_academica,
    promover_estudiantes
});