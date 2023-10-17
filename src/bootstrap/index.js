// eslint-disable-next-line node/no-missing-import,import/no-unresolved
import app from "../app.js";
import config from "../config";
import startDB from "./database.js";

export default async function startServer() {
  await startDB(config.dbUrl);
  return app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
    console.log("Server started");
  });
}
