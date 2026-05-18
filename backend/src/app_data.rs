use crate::auth::oidc::Oidc;

pub struct AppData {
    pub db: sea_orm::DbConn,
    pub oidc: Oidc,
}

impl AppData {
    pub async fn from_env() -> Self {
        // Setup the database and run the migrator
        let db = {
            use migration::{Migrator, MigratorTrait};
            let database_url = std::env::var("DATABASE_URL")
                .expect(r#"Missing environment variable "DATABASE_URL""#);
            let db = sea_orm::Database::connect(&database_url)
                .await
                .expect("Unable to connect to database");
            Migrator::up(&db, None)
                .await
                .expect("Failed to run migrations");
            db
        };

        let oidc = Oidc::from_env().await;

        Self { db, oidc }
    }

    // TODO: remove when adding login
    pub fn dummy_user(&self) -> uuid::Uuid {
        use uuid::Uuid;
        lazy_static::lazy_static! {
            pub static ref DUMMY_USER_UUID: Uuid = Uuid::parse_str("00000000-0000-4000-b000-000000000000").unwrap();
        }

        *DUMMY_USER_UUID
    }
}

#[cfg(test)]
pub struct TestAppData {
    pub db: sea_orm::DbConn,
}

#[cfg(test)]
impl TestAppData {
    /// For test purposes only.
    /// Create an empty SQLite database in memory
    pub async fn test() -> Self {
        let db = {
            use migration::{Migrator, MigratorTrait};
            let db = sea_orm::Database::connect("sqlite::memory:")
                .await
                .expect("Unable to connect to database");
            Migrator::up(&db, None)
                .await
                .expect("Failed to run migrations");
            db
        };
        TestAppData { db }
    }
}

pub fn env_var(key: &str) -> String {
    match std::env::var(key) {
        Ok(x) => x,
        Err(_) => {
            panic!("Missing environement variable: {key}");
        }
    }
}

pub fn env_var_default(
    key: &str,
    default_name: &str,
    r#default: impl FnOnce() -> Option<String>,
) -> String {
    match std::env::var(key) {
        Ok(x) => x,
        Err(_) => match r#default() {
            Some(x) => x,
            None => {
                panic!("Missing environement variable: {key} (set {default_name} to use default)")
            }
        },
    }
}
