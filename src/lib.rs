use napi::bindgen_prelude::*;
use napi_derive::napi;
use proxy_server::http::{request::Request, Http, CRLF};
use std::{io::Write, net::TcpListener, str};

#[napi]
pub fn server<T>(callback: T) -> Result<()>
where
    T: Fn(String) -> Result<(String, u16, String)>,
{
    target("127.0.0.1:4001", callback)
}

pub fn target<T>(addr: &str, callback: T) -> Result<()>
where
    T: Fn(String) -> Result<(String, u16, String)>,
{
    let listener = TcpListener::bind(addr)?;
    println!("listening on: {}", addr);
    for stream in listener.incoming() {
        let st = stream;
        if let Err(err) = st {
            println!("Failed to create connection {:?}: {}", err, &addr);
            continue;
        }
        let st = st.unwrap();
        let mut client = Http::from(st);

        let h = client.read_headers();
        if let Err(err) = h {
            println!("Failed to read headers {:?}: {:?}", err, &client.socket);
            continue;
        }
        let h = h.unwrap();

        let mut req = Request::new(h);
        let body = client.read_body(&req);
        if let Err(err) = body {
            println!("Failed to read body {:?}: {:?}", err, &req);
            continue;
        }
        let body = body.unwrap();

        let body = client.body_to_string(body);
        if let Err(err) = body {
            println!("Failed to stringify body {:?}: {:?}", err, &req);
            continue;
        }
        req.body = body.unwrap();

        let cb_res = callback(serde_json::to_string(&req).unwrap());
        if let Err(err) = cb_res {
            println!("Failed to handle request {:?}: {:?}", err, &req);
            continue;
        }
        let (result, code, headers) = cb_res.unwrap();

        println!("headers {:?}", headers);

        let length = result.len();
        let res_heads = format!(
            "Content-Type: application/json{CRLF}Content-Length: {length}{CRLF}Server: sync-server{CRLF}"
        );
        let res = client.set_status(code);
        if let Err(err) = res {
            println!("Failed to set status code {:?}: {:?}", err, &req);
            continue;
        }
        let res = client.write(res_heads.as_bytes());
        if let Err(err) = res {
            println!("Failed to write headers {:?}: {:?}", err, &req);
            continue;
        }

        let res = client.set_end_line();
        if let Err(err) = res {
            println!("Failed to set end line {:?}: {:?}", err, &req);
            continue;
        }

        let res = client.write(result.as_bytes());
        if let Err(err) = res {
            println!("Failed to write response {:?} {:?}", err, &req);
            continue;
        }

        let res = client.set_zero_byte();
        if let Err(err) = res {
            println!("Failed to set zero byte {:?}: {:?}", err, &req);
            continue;
        }

        let res = client.flush();
        if let Err(err) = res {
            println!("Failed to flush client {:?} {:?}", err, &req);
            continue;
        }
    }
    Ok(())
}
