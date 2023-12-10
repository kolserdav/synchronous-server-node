const { syncServer } = require("../syncServer");

syncServer(async (d) => {
  console.log(1, d);
  const res = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.stringify({ hello: "world" }));
    }, 1000);
  });
  return res;
});
