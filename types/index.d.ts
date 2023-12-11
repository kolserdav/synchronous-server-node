export type Server = typeof import("./index").server;
export type Header = import("./index").Header;
export type Request = import("./index").Request;
export type Response = {
    status: (code: number) => {
        json: (data: object) => void;
    };
};
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
 * @typedef {{status: (code: number) => { json: (data: object) => void }}} Response
 */
/**
 * @type {Response}
 */
export const response: Response;
