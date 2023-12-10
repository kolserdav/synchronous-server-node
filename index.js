// @ts-check
const { v4 } = require("uuid");
const { writeFileSync, unlinkSync } = require("fs");
const { testCallback } = require("./sync-server.node");
const { spawnSync } = require("child_process");
const path = require("path");
const pack = require("./package.json");
const os = require("os");

const RESERVE_CB_NAME = "_sync_server_reserve_cb_name";

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
    if (rr.stderr) {
      const warnT = rr.stderr.toString();
      if (!/^\s+$/.test(warnT) && warnT !== "") {
        console.warn(warnT);
      }
    }
    const resA = resS.split("\n").filter((item) => item !== "");

    const consoleV = resA.filter((_, i) => i !== resA.length - 1).join("\n");
    console.log(consoleV);

    return resA[resA.length - 1];
  });
}

function createStringFunc(cb) {
  let cbStr = cb.toString();
  const propM = cbStr.match(/\([a-zA-Z0-9_]*\)/);
  const prop = propM ? propM[0].replace(/[\(\)]+/g, "") : "";
  const body = cbStr.substring(cbStr.indexOf("{") + 1, cbStr.lastIndexOf("}"));
  cbStr = `async function cb(${prop}) {\n${body}\n}`;

  async function _sync_server_reserve_cb_name() {
    const props = "";
    const res = await cb(props);
    console.log(res);
  }
  const resCbStr = _sync_server_reserve_cb_name
    .toString()
    .replace(
      `async function ${RESERVE_CB_NAME}() {`,
      `async function ${RESERVE_CB_NAME}() {\n\t${cbStr}\n`
    )
    .replace('const props = "";', "const props = JSON.parse(process.argv[2]);");
  return `${resCbStr}\n${RESERVE_CB_NAME}();`;
}

async function cb(d) {
  const res = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.stringify({ test: "guest" }));
    }, 0);
  });
  return res;
}
syncServer(cb);
