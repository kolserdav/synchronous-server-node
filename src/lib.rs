use napi::bindgen_prelude::*;
use napi_derive::napi;
use proxy_server::{
    http::{
        headers::{Header, Headers},
        request::{Request, Socket},
        status::Status,
        Http,
    },
    prelude::constants::HTTP_VERSION_DEFAULT,
};
use serde_json::{from_str, Value};
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

        let error = client.socket.take_error().unwrap();
        let error = match error {
            None => "".to_string(),
            Some(val) => val.to_string(),
        };

        let req = Request::new(
            Socket {
                host: client.socket.local_addr().unwrap().to_string(),
                peer_addr: client.socket.peer_addr().unwrap().to_string(),
                ttl: client.socket.ttl().unwrap(),
                error,
            },
            h,
        );
        if let Err(err) = req {
            println!("Failed to create request {:?}: {:?}", err, &client.socket);
            continue;
        }
        let mut req = req.unwrap();

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

        let heads: Value = from_str(headers.as_str()).unwrap();

        if code == 301 {
            println!("headers {:?}", heads);
        }

        let length = result.len();

        let status = Status::new(code);
        let res_heads = Headers::new(
            format!("{} {} {}", HTTP_VERSION_DEFAULT, status.code, status.name).as_str(),
            vec![
                Header {
                    name: "Content-Type".to_string(),
                    value: "application/json".to_string(),
                },
                Header {
                    name: "Content-Length".to_string(),
                    value: length.to_string(),
                },
                Header {
                    name: "Server".to_string(),
                    value: "synchronous-server".to_string(),
                },
            ],
        );

        let res = client.write(res_heads.raw.as_bytes());
        if let Err(err) = res {
            println!("Failed to write headers {:?}: {:?}", err, &req);
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
