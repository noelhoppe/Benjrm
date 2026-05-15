pub struct AppData {
    pub db: sea_orm::DbConn,
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

        Self { db }
    }
}
