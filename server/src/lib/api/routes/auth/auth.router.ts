import { createTRPCRouter } from "../../trpc";
import { whoami } from "./usecase/query/whoami.usecase";
import { login } from "./usecase/command/login.usecase";

export const AUTH_ROUTER = createTRPCRouter({
    login,
    whoami
})