import { serve } from "@hono/node-server";
import { app } from "./index.js";

const port = 3001;
console.log(`🔥 Hono API server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
