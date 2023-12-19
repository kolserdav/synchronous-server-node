export type Request<T> = Omit<RequestHTTP, 'body'> & {
    body: T | null;
};
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
export type RequestHTTP = import("./index").Request;
/**
 *
 * @param {number} port
 * @param {string} workerFilePath
 */
export function startServer(port: number, workerFilePath: string): void;
/**
 * @template T
 * @typedef {Omit<RequestHTTP, 'body'> & {body: T | null}} Request
 */
/**
 * @template T
 * @returns {Request<T>}
 */
export function request<T>(): Request<T>;
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
export function response<T>(data: T, options?: ResponseOptions): void;
