// @ts-check
(async () => {
  const URL = "http://127.0.0.1:4001";
  const start = new Date().getTime();
  const req1 = fetch(URL);
  const req2 = fetch(URL);
  req1.then((d) => {
    d.text().then((d1) => {
      console.log(d1, new Date().getTime() - start);
    });
  });
  req2.then((d) => {
    d.text().then((d1) => {
      console.log(d1, new Date().getTime() - start);
    });
  });
})();
