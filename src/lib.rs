use napi::bindgen_prelude::*;
use napi_derive::napi;
use proxy_server::{
    http::{Http, Status, CRLF},
    request::Request,
};
use std::{
    io::{ErrorKind, Read, Write},
    net::{Shutdown, TcpListener},
    str,
    time::Duration,
};

#[napi]
pub fn server<T>(callback: T) -> Result<()>
where
    T: Fn(String) -> Result<String>,
{
    target("127.0.0.1:4001", callback)
}

pub fn target<T>(addr: &str, callback: T) -> Result<()>
where
    T: Fn(String) -> Result<String>,
{
    let listener = TcpListener::bind(addr)?;
    println!("listening on: {}", addr);
    'a: for stream in listener.incoming() {
        let st = stream?;
        let mut client = Http::from(st);

        let h = client.read_headers()?;
        let mut req = Request::new(h);
        let body = client.read_body(&req)?;
        req.body = client.body_to_string(body)?;

        let result = callback(serde_json::to_string(&req).unwrap())?;
        let length = result.len();
        let res_heads = format!(
            "Content-Type: application/json{CRLF}Content-Length: {length}{CRLF}Server: sync-server{CRLF}"
        );
        client.set_status(Status::OK)?;
        client.write(res_heads.as_bytes())?;
        client.set_end_line()?;
        client.write(result.as_bytes())?;

        client.set_zero_byte()?;
        client.flush()?;
    }
    Ok(())
}
