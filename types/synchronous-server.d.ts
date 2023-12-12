/**
 * Response headers
 */
export type HeadersLocal = Record<string, string>;
export type Server = typeof import("./index").server;
export type Headers = import("./index").Headers;
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
 * Response headers
 * @typedef {Record<string, string>} HeadersLocal
 */
/**
 * Response result to client
 * @param {any} data
 * @param {{
 *  code: number;
 *  headers?: HeadersLocal
 * }} options
 */
export function response(data: any, { code, headers }: {
    code: number;
    headers?: HeadersLocal;
}): void;
