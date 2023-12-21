// KeystoneJS server config
type DB_PROVIDER_TYPE = "sqlite" | "mysql" | "postgresql";

export const KS_PORT = parseInt(process.env.KS_PORT || "3000");

export const DB_PROVIDER: DB_PROVIDER_TYPE =
  (process.env.DB_PROVIDER as DB_PROVIDER_TYPE) || "sqlite";

export const DATABASE_URL = process.env.DATABASE_URL || "file://keystone.db";

// KeystoneJS & GraphQL Server
export const SERVER_URL = new URL(
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://locahost:3000"
);

export const GRAPHQL_PATH =
  process.env.NEXT_PUBLIC_GRAPHQL_PATH ?? "/api/graphql";

export const GRAPHQL_ENDPOINT = new URL(GRAPHQL_PATH, SERVER_URL);

export const GST_MULTIPLIER = parseFloat(
  process.env.NEXT_PUBLIC_GST_MULTIPLIER || "0.1"
);