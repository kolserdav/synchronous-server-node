export type Request<Q, B> = Omit<RequestHTTP, 'body' | 'query'> & {
    body: B;
    query: Q;
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
 * @template Q,B
 * @typedef {Omit<RequestHTTP, 'body' | 'query'> & {body: B, query: Q}} Request
 */
/**
 * @template Q,B
 * @returns {Request<Q, B>}
 */
export function request<Q, B>(): Request<Q, B>;
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
