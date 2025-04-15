import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { ROOT_ROUTER, createExpressTRPCContext } from "@swai/server";
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import morgan from "morgan";


const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(morgan('combined'));

/* .................................. trpc .................................. */

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({
    router: ROOT_ROUTER,
    createContext: createExpressTRPCContext({dependencies: {
      prisma: new PrismaClient()
    }}),
    onError: ({ error }) => {
      console.error('Error in trpc middleware:', error);
    }
  })
);

app.listen(Number(port), host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
