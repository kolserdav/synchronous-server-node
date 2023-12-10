use napi::bindgen_prelude::*;
use napi_derive::napi;
use proxy_server::{
    headers::Headers,
    http::{Http, Status, CRLF},
};
use std::{
    io::Write,
    net::{TcpListener, TcpStream},
    str,
};
use std::{
    thread::{sleep, spawn},
    time::Duration,
};

#[napi]
fn server<T>(callback: T) -> Result<()>
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
    for stream in listener.incoming() {
        let mut client = Http::from(stream?);

        let h = client.read_headers()?;
        let heads = Headers::new(h);

        let result = callback(serde_json::to_string(&heads.parsed).unwrap())?;
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
