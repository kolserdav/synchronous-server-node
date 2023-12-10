export type Server = typeof import("./index").server;
/**
 *
 * @param {(d: string) => any} cb
 */
export function syncServer(cb: (d: string) => any): void;
