import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

export const expoDatabase = SQLite.openDatabaseSync('quiz-app.db');
export const db = drizzle(expoDatabase, { schema });

// Live queries connection (for reactive UI)
export const liveDatabase = SQLite.openDatabaseSync('quiz-app.db', {
  enableChangeListener: true
});
export const liveDb = drizzle(liveDatabase, { schema });

// Optimize SQLite for mobile performance
export async function optimizeDatabase() {
  await expoDatabase.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA cache_size = 1000;
    PRAGMA foreign_keys = ON;
    PRAGMA temp_store = MEMORY;
  `);
}