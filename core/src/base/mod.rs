use std::{fmt::Display, sync::{Arc, Mutex}};

use axum::{body::Body, http::{Response, StatusCode}, response::IntoResponse};
use uuid::Uuid;

use crate::imp::database::DbConnectionDetails;

use self::{config::Config, table::{TableConfig, TableList}};

pub(crate) mod auth;
pub(crate) mod config;
pub(crate) mod foundation;
pub(crate) mod table;

/// Basable base trait that must be implemented by every instance of connection in Basable.
///
/// Check `imp` module for different implementations of this trait.
pub(crate) trait BasableConnection: Send + Sync {
    type Error;
    /// A new instance of BasableConnection
    fn new(conn: Config, user_id: &str) -> Result<Self, Self::Error>
    where
        Self: Sized;

    fn get_id(&self) -> Uuid;

    fn get_user_id(&self) -> &str;

    /// Details about the connection
    fn details(&self) -> Result<DbConnectionDetails, Self::Error>;

    /// Load table summaries
    fn load_tables(&self) -> Result<TableList, Self::Error>;

    /// Check if a table with the given name exists in the database connection.
    fn table_exists(&self, name: &str) -> Result<bool, Self::Error>;

    /// Saves a table configuration. If `save_local` is true, it saves in memore using
    /// `BasableConnection` instance. Otherwise, it saves to remote server.
    fn save_table_config(
        &mut self,
        table_name: &str,
        table_config: TableConfig,
        save_local: bool,
    ) -> Result<(), Self::Error>;

    fn get_table_config(
        &mut self,
        table_name: &str,
        get_local: bool,
    ) -> Result<TableConfig, Self::Error>;
}


type SharedConnection = Arc<Mutex<dyn BasableConnection<Error = AppError>>>;

#[derive(Debug)]
pub(crate) struct AppError(pub StatusCode, pub String);

impl AppError {
    pub(crate) fn new(code: StatusCode, msg: &str) -> Self {
        AppError(code, String::from(msg))
    }
}

impl Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} {}", self.0, self.1)
    }
}

/// Implements conversion of `mysql::Error` to AppError. At the moment, all variations
/// of `mysql::Error` resolves to `StatusCode::INTERNAL_SERVER_ERROR`.
impl From<mysql::Error> for AppError {
    fn from(value: mysql::Error) -> Self {
        Self(StatusCode::INTERNAL_SERVER_ERROR, value.to_string())
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response<Body> {
        (self.0, self.1).into_response()
    }
}
