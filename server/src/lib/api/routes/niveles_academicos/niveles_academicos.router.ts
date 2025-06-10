import { createTRPCRouter } from "../../trpc";
import { añadir_seccion_academica } from "./usecase/command/añadir_seccion_academica.usecase";

export const NIVELES_ACADEMICOS_ROUTER = createTRPCRouter({
    añadir_seccion_academica
});