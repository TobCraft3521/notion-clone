import type { Config } from "drizzle-kit"

if (!process.env.DATABASE_URL) {
  console.log("🔴 Cannot find database url")
}

export default {
  schema: "./lib/supabase/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
} satisfies Config
