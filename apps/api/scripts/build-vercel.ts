import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "../src/vercel-handler.ts");
const DEST = path.resolve(__dirname, "../../../api/[[...route]].ts");

fs.copyFileSync(SRC, DEST);
console.log(`✅ Copied vercel-handler.ts to api/[[...route]].ts`);
