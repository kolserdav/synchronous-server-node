use napi::bindgen_prelude::*;
use napi_derive::napi;

#[napi]
fn test_callback<T>(callback: T)
where
    T: Fn(String) -> Result<()>,
{
    callback("test".to_string());
}
