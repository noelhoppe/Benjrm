# Benjrm's database migrator

You will probably only use this migrator directly to create new migrations. While you can apply or rollback migrations directly using this tool, the backend will automatically apply all pending migrations during startup.

Supported databases backends currently are:
- PostgreSQL
- SQLite

## Generate a new migration file

```bash
$ cargo run -- generate <migration_name>
```

## Apply migrations

To apply migrations using the migrator directly, you have to pass the database url to it:

```bash
$ DATABASE_URL="<db_url>" cargo run -- <command>
```

Important commands:
- **up:** Apply all pending migrations
- **down:** Rollback last applied migration
- **fresh:** Drop all tables from the database, then apply all migrations
- **help:** Display all commands
