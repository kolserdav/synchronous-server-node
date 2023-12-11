const path = require("path");
const { syncServer } = require("../../synchronous-server");

syncServer(path.resolve(__dirname, "worker.js"));
