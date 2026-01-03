import { handle } from "hono/vercel";
import { app } from "../apps/api/src/index.js";

export const config = {
  runtime: "edge",
};

export const handler = handle(app);
