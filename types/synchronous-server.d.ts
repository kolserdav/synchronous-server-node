/**
 * Response options
 */
export type HeadersLocal = Record<string, string>;
/**
 * Response headers
 */
export type ResponseOptions = {
    code?: number;
    headers?: HeadersLocal;
};
export type Server = typeof import("./index").server;
export type Headers = import("./index").Headers;
export type Request = import("./index").Request;
/**
 *
 * @param {number} port
 * @param {string} workerFilePath
 */
export function startServer(port: number, workerFilePath: string): void;
/**
 * @returns {Request | null}
 */
export function request(): Request | null;
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
export function response<T>(data: T, options?: ResponseOptions | null): void;
