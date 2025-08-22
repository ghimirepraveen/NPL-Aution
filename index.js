const http = require("http");
const app = require("./server/config/express");

//connect to DataBase
const { connectDBurl } = require("./server/config/database");
connectDBurl();

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }
  return false;
}

const port = normalizePort(process.env.API_PORT || "5000");
app.set("port", port);

const server = http.createServer(app);

// Start server
const startServer = async () => {
  try {
    // Start HTTP server
    server.listen(port, () => {
      console.info(
        `<< ${process.env.NODE_ENV} server started on >> ${process.env.API_HOST}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Received SIGINT. Graceful shutdown...");

  try {
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Graceful shutdown...");

  try {
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

app.on("error", onError);

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
}
