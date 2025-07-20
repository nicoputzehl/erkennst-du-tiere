import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './db/schema.ts',
  out: './drizzle',
  migrations: {
    prefix: 'timestamp',
    table: '__drizzle_migrations__',
  },
  verbose: true,
  strict: true,
});