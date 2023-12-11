export type Server = typeof import("./index").server;
export type Header = import("./index").Header;
export type Request = import("./index").Request;
/**
 *
 * @param {(d: string) => any} cb
 */
export function syncServer(cb: (d: string) => any): void;
/**
 *
 * @param {string} raw
 * @returns {Request | null}
 */
export function parseRequest(raw: string): Request | null;
