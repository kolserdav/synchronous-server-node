use napi::bindgen_prelude::{Error, Result, Status};
use napi_derive::napi;
use std::io::{Error as ErrorIO, ErrorKind};
use synchronous_server::listen;

#[napi]
pub fn server<T>(port: u16, callback: T) -> Result<()>
where
    T: Fn(String) -> Result<(String, u16, String)>,
{
    let res = listen(format!("0.0.0.0:{port}").as_str(), |d| {
        let res = callback(d);
        if let Err(err) = res {
            return Err(ErrorIO::new(
                ErrorKind::Other,
                format!("Failed to run callback: {:?}", err),
            ));
        }
        let res = res.unwrap();
        Ok(res)
    });
    if let Err(err) = res {
        return Err(Error::new(
            Status::Unknown,
            format!("Failed to listen server: {:?}", err),
        ));
    }
    Ok(())
}
