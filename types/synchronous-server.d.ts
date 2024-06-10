export type RequestHTTP = {
    url: string;
    query: Record<string, string>;
    body: any;
    headers: Record<string, string>;
    method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'OPTION';
};
export type Request<Q, B> = Omit<RequestHTTP, 'body' | 'query'> & {
    body: B | undefined;
    query: Q | undefined;
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
/**
 * @template Q,B
 * @typedef {Omit<RequestHTTP, 'body' | 'query'> & {body: B | undefined, query: Q | undefined}} Request
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
/**
 * @typedef {{
 *  url: string;
 *  query: Record<string, string>
 *  body: any;
 *  headers: Record<string, string>
 *  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'OPTION'
 * }} RequestHTTP
 */
/**
 *
 * @param {{
 *  port: number;
 *  workerPath: string;
 * }} param0
 * @param {() => void} cb
 */
export function startServer({ port, workerPath }: {
    port: number;
    workerPath: string;
}, cb?: () => void): void;
