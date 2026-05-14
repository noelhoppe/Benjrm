use {
    actix_web::{HttpResponse, ResponseError},
    sea_orm::DbErr,
    std::fmt,
};

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug)]
pub enum Error {
    NotFound,
    Forbidden,
    Database(DbErr),
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Debug::fmt(self, f)
    }
}

impl ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        match self {
            Error::NotFound => HttpResponse::NotFound().finish(),
            Error::Forbidden => HttpResponse::Forbidden().finish(),
            Error::Database(db_err) => {
                log::error!("{db_err:?}");
                if cfg!(debug_assertions) {
                    HttpResponse::InternalServerError().body(db_err.to_string())
                } else {
                    HttpResponse::InternalServerError().finish()
                }
            }
        }
    }
}
