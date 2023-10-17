import startServer from "./bootstrap/index.js";

// eslint-disable-next-line unicorn/prefer-top-level-await
const server = startServer().catch((error) => console.log(error));

function exitHandler() {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    });
  } else {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
}

function unexpectedErrorHandler(error) {
  console.log(error);
  exitHandler();
}

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});
