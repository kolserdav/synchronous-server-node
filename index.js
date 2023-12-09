// @ts-check
const { v4 } = require("uuid");
const { writeFileSync, unlinkSync } = require("fs");
const { testCallback } = require("./sync-server.node");
const { spawnSync } = require("child_process");
const path = require("path");
const pack = require("./package.json");
const os = require("os");

function syncServer(cb) {
  const tmpFilePath = path.resolve(os.tmpdir(), `${pack.name}-${v4()}.js`);
  const data = createStringFunc(cb.toString());
  writeFileSync(tmpFilePath, data);
  testCallback((d) => {
    const ex = `node ${tmpFilePath}  ${JSON.stringify(d)}`;
    const rr = spawnSync(ex, {
      shell: true,
    });
    const resS = rr.stdout.toString();
    if (rr.error) {
      console.error(rr.error);
      return JSON.stringify({ error: "Failed to execute callback", data });
    }
    console.log(resS);
    if (rr.stderr) {
      console.warn(rr.stderr.toString());
    }
    const resA = resS.split("\n").filter((item) => item !== "");
    return resA[resA.length - 1];
  });
}

function createStringFunc(fn) {
  let _fn = `${fn}`;
  const fNameM = fn.match(
    /(async)* function\s+[a-zA-Z0-9_]+\([a-zA-Z0-9_]+\)\s*{/
  );
  if (fNameM) {
    const fName = fNameM[0];
    const argM = fName.match(/\([a-zA-Z0-9_]\)/);
    const defineArg = argM
      ? `const ${argM[0].replace(/[()]+/g, "")} = JSON.parse(process.argv[2]);`
      : "";
    _fn = `${fn.replace(
      fName,
      `async function cb() {\n${defineArg}\n`
    )}\ncb();`;
  }

  return _fn;
}

async function cb(d) {
  const res = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.stringify({ test: "guest" }));
    }, 100);
  });
  console.log(res);
}
syncServer(cb);
