const path = require("path");
const { startServer } = require("../../synchronous-server.js");

// Create an abs path to worker.js file
const workerPath = path.resolve(__dirname, "worker.js");

const port = 4001;
startServer({ workerPath, port }, () => {
  console.log("Listen:", port);
});
