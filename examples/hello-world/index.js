const path = require("path");
const { startServer } = require("../../synchronous-server");

// Create an abs path to worker.js file
const workerPath = path.resolve(__dirname, "worker.js");

startServer(4001, workerPath);
