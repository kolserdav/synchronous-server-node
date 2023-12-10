const { v4 } = require("uuid");
const { writeFileSync } = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");
const os = require("os");
const pack = require("./package.json");
// @ts-ignore
const { server: _server } = require("./sync-server.node");

/**
 * @typedef {import("./index").server} Server
 */

/**
 * @type {Server}
 */
const server = _server;

const RESERVE_CB_NAME = "_sync_server_reserve_cb_name";
const RESERVE_PROPS_NAME = "_sync_server_reserve_props_name";
const RESERVE_RES_NAME = "_sync_server_reserve_res_name";
const RESERVE_USER_CB_NAME = "_sync_server_reserve_user_cb_name";

/**
 *
 * @param {(d: string) => any} cb
 */
function syncServer(cb) {
  const tmpFilePath = path.resolve(os.tmpdir(), `${pack.name}-${v4()}.js`);
  const data = createStringFunc(cb.toString());
  writeFileSync(tmpFilePath, data);
  server((d) => {
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

/**
 *
 * @param {string} cbStr
 * @returns
 */
function createStringFunc(cbStr) {
  const propM = cbStr.match(/\([a-zA-Z0-9_]*\)/);
  const prop = propM ? propM[0].replace(/[\(\)]+/g, "") : "";
  const body = cbStr.substring(cbStr.indexOf("{") + 1, cbStr.lastIndexOf("}"));
  cbStr = `async function ${RESERVE_USER_CB_NAME}(${prop}) {\n${body}\n}`;

  async function _sync_server_reserve_cb_name() {
    const _sync_server_reserve_props_name = "";
    const _sync_server_reserve_res_name = "";
    console.log(_sync_server_reserve_res_name);
  }
  const resCbStr = _sync_server_reserve_cb_name
    .toString()
    .replace(
      `async function ${RESERVE_CB_NAME}() {`,
      `async function ${RESERVE_CB_NAME}() {\n\t${cbStr}\n`
    )
    .replace(
      `const ${RESERVE_PROPS_NAME} = "";`,
      `const ${RESERVE_PROPS_NAME} = JSON.parse(process.argv[2]);\n`
    )
    .replace(
      `const ${RESERVE_RES_NAME} = ""`,
      `const ${RESERVE_RES_NAME} = await ${RESERVE_USER_CB_NAME}(${RESERVE_PROPS_NAME});\n`
    );
  return `${resCbStr}\n${RESERVE_CB_NAME}();`;
}

module.exports = { syncServer };
