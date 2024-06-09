const { request, response } = require("../../synchronous-server");

(async () => {
  const req = request();

  console.log(`method: ${req.method}, url: ${req.url}`);
  console.log("headers", req.headers);
  const res = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({ hello: "world", body: req.body });
    }, 0);
  });

  response(res);
})();
