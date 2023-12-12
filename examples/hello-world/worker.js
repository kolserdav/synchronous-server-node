const { request, response } = require("../../synchronous-server");

(async () => {
  const req = request();
  const res = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  });
  console.log(req);

  response({ d: "ds" }, { code: 301 });
})();
