/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

/** HTTP header */
export interface Header {
  name: string
  value: string
}
/** HTTP headers */
export interface Headers {
  raw: string
  list: Array<Header>
}
/** HTTP request */
export interface Request {
  url: string
  host: string
  peerAddr: string
  protocol: string
  method: string
  contentLength: number
  ttl: number
  headers: Headers
  body: string
  query: string
  error: string
  chunked: boolean
}
export function server(port: number, callback: (arg0: Request) => [string, number, Headers]): void
