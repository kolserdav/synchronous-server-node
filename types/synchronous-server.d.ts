/**
 * HTTP status return 501 if not allowed. Allowed statuses: https://docs.rs/proxy-server/latest/src/proxy_server/http/status.rs.html
 */
export type Code = number;
/**
 * Response headers
 */
export type Headers = Record<string, string>;
export type Server = typeof import("./index").server;
export type Header = import("./index").Header;
export type Request = import("./index").Request;
/**
 *
 * @param {string} workerFilePath
 */
export function syncServer(workerFilePath: string): void;
/**
 * @returns {Request | null}
 */
export function request(): Request | null;
/**
 * HTTP status return 501 if not allowed. Allowed statuses: https://docs.rs/proxy-server/latest/src/proxy_server/http/status.rs.html
 * @typedef {number} Code
 */
/**
 * Response headers
 * @typedef {Record<string, string>} Headers
 */
/**
 * Response result to client
 * @param {any} data
 * @param {{
 *  code: Code;
 *  headers?: Headers
 * }} options
 */
export function response(data: any, { code, headers }: {
    code: Code;
    headers?: Headers;
}): void;
