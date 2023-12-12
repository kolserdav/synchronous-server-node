use napi_derive::napi;
use napi::bindgen_prelude::{Result, Error, Status};
use std::io::{Error as ErrorIO, Result as ResultIO, ErrorKind};
use synchronous_server::listen;

#[napi]
pub fn server<T>(callback: T) -> Result<()>
where
    T: Fn(String) -> Result<(String, u16, String)>,
{
    let res = listen("127.0.0.1:4001",|d| {
        let res = callback(d);
        if let Err(err) = res {
            return Err(ErrorIO::new(ErrorKind::Other, "tes"));
        }
        let res = res.unwrap();
        Ok(res)
    } );
    Ok(())
}

