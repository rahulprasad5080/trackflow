import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export const initDB = async (): Promise<SQLite.SQLiteDatabase> => {
  db = await SQLite.openDatabaseAsync('trackflow.db');

  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      goal INTEGER DEFAULT 1,
      unit TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      archived INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      value INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      time TEXT NOT NULL,
      days TEXT, -- JSON array of days [1, 2, 3]
      notification_id TEXT,
      enabled INTEGER DEFAULT 1, -- Boolean 0 or 1
      FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration: Add enabled column if it doesn't exist
  try {
    const tableInfo = await db.getAllAsync<any>("PRAGMA table_info(reminders)");
    const hasEnabled = tableInfo.some(col => col.name === 'enabled');
    if (!hasEnabled) {
      await db.execAsync('ALTER TABLE reminders ADD COLUMN enabled INTEGER DEFAULT 1');
    }
  } catch (e) {
    console.error('Migration failed:', e);
  }

  console.log('Database initialized');
  return db;
};

export const getDB = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db;
};
