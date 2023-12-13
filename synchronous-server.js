const { spawnSync } = require("child_process");
// @ts-ignore
const { server: _server } = require("./synchronous-server.node");

const HTTP_CODE_DEFAULT = 200;

/**
 * @typedef {import("./index").server} Server
 * @typedef {import("./index").Headers} Headers
 * @typedef {import("./index").Request} Request
 */

/**
 * @private
 * @type {Server}
 */
const server = _server;

/**
 *
 * @param {number} port
 * @param {string} workerFilePath
 */
function startServer(port, workerFilePath) {
  server(port, (d) => {
    const ex = `node ${workerFilePath}  ${JSON.stringify(d)}`;
    const rr = spawnSync(ex, {
      shell: true,
    });
    const resS = rr.stdout.toString();
    if (rr.error) {
      console.error(rr.error);
      return [
        JSON.stringify({
          error: "Failed to execute callback",
          workerFilePath,
        }),
        500,
        JSON.stringify({}),
      ];
    }
    if (rr.stderr) {
      const warnT = rr.stderr.toString();
      if (!/^\s+$/.test(warnT) && warnT !== "") {
        console.warn(1, warnT);
      }
    }
    const resA = resS.split("\n").filter((item) => item !== "");

    const consoleV = resA
      .filter(
        (_, i) =>
          i !== resA.length - 1 &&
          i !== resA.length - 2 &&
          i !== resA.length - 3
      )
      .filter((item) => !/^\s+$/.test(item))
      .filter((item) => item !== "");
    if (consoleV.length !== 0) {
      console.log(consoleV.join("\n"));
    }

    return [
      resA[resA.length - 1],
      parseInt(resA[resA.length - 2], 10),
      resA[resA.length - 3],
    ];
  });
}

/**
 * @returns {Request | null}
 */
function request() {
  const raw = process.argv[2];
  /**
   * @type {Request | null}
   */
  let req = null;
  try {
    req = JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse request", e);
  }
  return req;
}

/**
 * Response headers
 * @typedef {Record<string, string>} HeadersLocal
 * Response options
 * @typedef {{
 *  code?: number;
 *  headers?: HeadersLocal
 * }} ResponseOptions
 */

/**
 * Response result to client
 * @template T
 * @param {T} data
 * @param {ResponseOptions?} options
 */
function response(data, options = {}) {
  const { code, headers } = options;

  console.log(JSON.stringify(createHeaders(headers)));
  console.log(code || HTTP_CODE_DEFAULT);
  console.log(JSON.stringify(data));
}

/**
 *
 * @param {HeadersLocal} oldHeaders
 * @returns {Pick<Headers, 'list'> | undefined}
 */
function createHeaders(oldHeaders) {
  /**
   * @type {Headers}
   */
  const newHeaders = { raw: "", list: [] };
  newHeaders.list = Object.keys(oldHeaders || {}).map((item) => ({
    name: item,
    value: oldHeaders[item],
  }));
  return newHeaders;
}

module.exports = { startServer, request, response };
