use {
    crate::{auth::oidc::Oidc, static_file::StaticFile},
    std::path::PathBuf,
};

pub struct AppData {
    pub db: sea_orm::DbConn,
    pub imprint: StaticFile,
    pub oidc: Oidc,
}

impl AppData {
    pub async fn from_env() -> Self {
        let config_dir = PathBuf::from(std::env::var("CONFIG_DIR").unwrap_or(String::from(".")));
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

        let imprint = StaticFile::new(&config_dir, "imprint.md", "text/markdown").await;

        let oidc = Oidc::from_env().await;

        Self { db, imprint, oidc }
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

    pub async fn dummy_user_id(&self) -> uuid::Uuid {
        use {
            crate::auth::entity::ActiveUser,
            sea_orm::{ActiveModelTrait, ActiveValue::Set},
            uuid::Uuid,
        };

        let id = Uuid::new_v4();
        let user = ActiveUser {
            id: Set(id),
            subject: Set(id.to_string()),
        }
        .insert(&self.db)
        .await
        .unwrap();

        user.id
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
