const { request, response } = require("../../synchronous-server");

(async () => {
  const req = request();
  const res = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 0);
  });
  console.log(23, req);

  response("true");
})();
