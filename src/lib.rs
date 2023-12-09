use napi::bindgen_prelude::*;
use napi_derive::napi;
use proxy_server::http::{Http, Status, CRLF};
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
fn test_callback<T>(callback: T) -> Result<()>
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
    println!("listening target on {}", addr);
    for stream in listener.incoming() {
        let mut client = Http::from(stream?);

        let headers = read_headers(&mut client);
        println!("{:?}", headers);

        let result = callback("{\"tet\":\"tet\"}".to_string())?;
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

pub fn read_headers(client: &mut Http) -> Result<String> {
    let mut req_heads = vec![];
    client.read_headers(&mut req_heads)?;
    Ok(str::from_utf8(&req_heads).unwrap().to_string())
}
