import path from "node:path";
import dotenv from "dotenv";
import * as url from "node:url";

const envResult = dotenv.config({
  path: path.join(
    path.dirname(url.fileURLToPath(import.meta.url)),
    "../../.env"
  ),
});

if (envResult.error) {
  throw new Error("Couldn't find .env file");
}

export default {
  port: process.env.API_PORT,
  nodeEnv: process.env.NODE_ENV || "development",
  dbUrl: process.env.DATABASE,
  supertokensUri: process.env.SUPERTOKEN_URI,
  supertokensApiKey: process.env.SUPERTOKEN_API_KEY,
  appName: process.env.APP_NAME,
  apiUrl: process.env.API_URL,
};
