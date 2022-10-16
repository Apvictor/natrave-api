import Koa from "koa";
import cors from "@koa/cors";
import { router } from "./router.js";
import bodyParser from "koa-bodyparser";

export const app = new Koa();

app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
