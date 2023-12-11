// @ts-check
(async () => {
  const URL = "http://127.0.0.1:4001/tess";
  const start = new Date().getTime();

  const controller1 = new AbortController();
  const req1 = fetch(URL, {
    body: "1",
    method: "POST",
    //signal: controller1.signal,
  });
  const controller2 = new AbortController();
  const req2 = fetch(URL, {
    body: "2",
    method: "POST",
    //signal: controller2.signal,
  });
  const controller3 = new AbortController();
  const req3 = fetch(URL, {
    body: "3",
    method: "POST",
    //signal: controller3.signal,
  });

  req1.then((d) => {
    d.text().then((d1) => {
      console.log(1, d1, new Date().getTime() - start);
      //controller2.abort();
    });
  });
  req2.then((d) => {
    d.text().then((d1) => {
      console.log(2, d1, new Date().getTime() - start);
      //controller2.abort();
    });
  });
  req3.then((d) => {
    d.text().then((d1) => {
      console.log(3, d1, new Date().getTime() - start);
      //controller3.abort();
    });
  });
})();
