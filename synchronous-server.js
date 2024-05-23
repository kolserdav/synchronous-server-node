const { spawnSync } = require("child_process");
// @ts-ignore
const { server: _server } = require("./synchronous-server.node");

const HTTP_CODE_DEFAULT = 200;
const AMPRERSAND_REPLACE_SYMBOL = "AMPRERSAND_REPLACE_SYMBOL";

/**
 * @typedef {import("./index").server} Server
 * @typedef {import("./index").Headers} Headers
 * @typedef {import("./index").Request} RequestHTTP
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
    /**
     * @type {Headers}
     */
    let headers = { raw: "", list: [] };
    const ex = `node ${workerFilePath}  ${JSON.stringify(
      JSON.stringify(d)
    ).replaceAll("&", AMPRERSAND_REPLACE_SYMBOL)}`;
    const rr = spawnSync(ex, {
      shell: true,
      env: process.env,
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
        headers,
      ];
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
    if (rr.stderr) {
      const warnT = rr.stderr.toString();
      if (!/^\s+$/.test(warnT) && warnT !== "") {
        console.warn("Worker error", warnT);
      }
    }
    try {
      headers = JSON.parse(resA[resA.length - 3]);
    } catch (err) {
      console.error("Failed to parse headers", err);
    }

    return [
      resA[resA.length - 1],
      parseInt(resA[resA.length - 2], 10),
      headers,
    ];
  });
}

/**
 * @template Q,B
 * @typedef {Omit<RequestHTTP, 'body' | 'query'> & {body: B | undefined, query: Q | undefined}} Request
 */

/**
 * @template Q,B
 * @returns {Request<Q, B>}
 */
function request() {
  const raw = process.argv[2].replaceAll(AMPRERSAND_REPLACE_SYMBOL, "&");

  /**
   * @type {any}
   */
  let req = {};
  try {
    req = JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse request", e);
  }

  if (req.body !== "") {
    let body = castingTypes(req.body);
    try {
      body = JSON.parse(req.body);
    } catch (e) {
      // console.error("Failed to parse request body", e);
    }
    req.body = body;
  } else {
    req.body = undefined;
  }

  if (req.query !== "") {
    let query = {};
    const queryStr = req.query.replace("?", "");
    queryStr
      .split("&")
      .filter((item) => item !== "")
      .forEach((item) => {
        const keyM = item.match(/^[a-zA-Z0-9\-_\.]+=/);
        if (!keyM) {
          return;
        }
        const key = keyM[0].replace("=", "");
        const valueM = item.match(/=[a-zA-Z0-9\-_\.]+$/);
        if (!valueM) {
          query[key] = "";
          return;
        }
        const value = valueM[0].replace("=", "");

        query[key] = castingTypes(value);
      });
    req.query = query;
  } else {
    req.query = undefined;
  }

  return req;
}

/**
 * @param {string} value
 * @returns
 */
function castingTypes(value) {
  const floatVal = parseFloat(value);

  return value === "true" || value === "false"
    ? value === "true"
    : !Number.isNaN(floatVal)
    ? floatVal
    : value;
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
 * @param {ResponseOptions} options
 */
function response(data, options = {}) {
  const { code, headers } = options;

  console.log(JSON.stringify(createHeaders(headers)));
  console.log(code || HTTP_CODE_DEFAULT);
  console.log(JSON.stringify(data));
}

/**
 *
 * @param {HeadersLocal | undefined} oldHeaders
 * @returns {Pick<Headers, 'list'>}
 */
function createHeaders(oldHeaders) {
  /**
   * @type {Headers}
   */
  const newHeaders = { raw: "", list: [] };
  if (!oldHeaders) {
    return newHeaders;
  }

  newHeaders.list = Object.keys(oldHeaders).map((item) => ({
    name: item,
    value: oldHeaders[item],
  }));
  return newHeaders;
}

module.exports = { startServer, request, response };
