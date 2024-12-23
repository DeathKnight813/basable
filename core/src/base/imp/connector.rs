use crate::{base::config::ConfigRaw, AppError};

/// Facilitates connection and run queries between `Basable` instance and a databse server
pub(crate) trait Connector: Send + Sync {
    type Row;
    // type Error;
    /// Create a new connector
    fn new(conn: ConfigRaw) -> Result<Self, AppError>
    where
        Self: Sized;

    /// Execute a database query and return results
    fn exec_query(&self, query: &str) -> Result<Vec<Self::Row>, AppError>;

    fn config(&self) -> &ConfigRaw;
}
