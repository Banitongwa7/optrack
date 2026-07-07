/**
 * Local development database.
 *
 * Starts an embedded PostgreSQL server for development when no remote
 * database is available. Data is persisted in `.localdb/` (gitignored).
 *
 * Usage: npm run db:local  (keeps running; stop with Ctrl+C)
 */
import EmbeddedPostgres from "embedded-postgres";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, ".localdb");

const PORT = 5502;
const USER = "postgres";
const PASSWORD = "optrack";
const DATABASE = "optrack";

async function main() {
  const pg = new EmbeddedPostgres({
    databaseDir: dataDir,
    user: USER,
    password: PASSWORD,
    port: PORT,
    persistent: true,
  });

  if (!fs.existsSync(path.join(dataDir, "PG_VERSION"))) {
    await pg.initialise();
  }
  await pg.start();

  const client = pg.getPgClient();
  await client.connect();
  const { rowCount } = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [DATABASE]
  );
  if (rowCount === 0) {
    await pg.createDatabase(DATABASE);
  }
  await client.end();

  const url = `postgresql://${USER}:${PASSWORD}@localhost:${PORT}/${DATABASE}`;
  console.log(`\nLocal PostgreSQL ready: ${url}`);
  console.log("DATABASE_URL and DATABASE_URL_UNPOOLED point to it via .env.local.");
  console.log("Press Ctrl+C to stop.\n");

  const stop = async () => {
    await pg.stop();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
