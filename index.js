const { testCallback } = require("./sync-server.node");

testCallback((d) => {
  console.log(1, new Date());
  return JSON.stringify({ test: "kest" });
});
