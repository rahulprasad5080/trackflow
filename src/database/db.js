import * as SQLite from 'expo-sqlite';

let db;

export const initDB = async () => {
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
      FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
    );
  `);

    console.log('Database initialized');
    return db;
};

export const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized. Call initDB() first.');
    }
    return db;
};
