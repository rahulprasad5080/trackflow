import { Habit, Log } from '../types';
import { getDB } from './db';

export const habitService = {
    createHabit: async (habit: Partial<Habit>): Promise<number> => {
        const db = getDB();
        const result = await db.runAsync(
            'INSERT INTO habits (name, icon, color, goal, unit) VALUES (?, ?, ?, ?, ?)',
            [habit.name!, habit.icon!, habit.color!, habit.goal!, habit.unit!]
        );
        return result.lastInsertRowId;
    },

    getHabits: async (): Promise<Habit[]> => {
        const db = getDB();
        return await db.getAllAsync<Habit>('SELECT * FROM habits WHERE archived = 0');
    },

    updateHabit: async (id: number, updates: Partial<Habit>): Promise<void> => {
        const db = getDB();
        // Simplified update for now
        await db.runAsync(
            'UPDATE habits SET name = ?, icon = ?, color = ?, goal = ?, unit = ? WHERE id = ?',
            [updates.name!, updates.icon!, updates.color!, updates.goal!, updates.unit!, id]
        );
    },

    deleteHabit: async (id: number): Promise<void> => {
        const db = getDB();
        await db.runAsync('UPDATE habits SET archived = 1 WHERE id = ?', [id]);
    },

    logHabit: async (habitId: number, date: string, value: number): Promise<void> => {
        const db = getDB();
        // Check if log exists
        const existing = await db.getFirstAsync<Log>(
            'SELECT * FROM logs WHERE habit_id = ? AND date = ?',
            [habitId, date]
        );

        if (existing) {
            await db.runAsync(
                'UPDATE logs SET value = ? WHERE id = ?',
                [value, existing.id]
            );
        } else {
            await db.runAsync(
                'INSERT INTO logs (habit_id, date, value) VALUES (?, ?, ?)',
                [habitId, date, value]
            );
        }
    },

    getDailyLogs: async (date: string): Promise<Habit[]> => {
        const db = getDB();
        return await db.getAllAsync<Habit>(
            `SELECT h.*, l.value, l.completed 
       FROM habits h 
       LEFT JOIN logs l ON h.id = l.habit_id AND l.date = ? 
       WHERE h.archived = 0`,
            [date]
        );
    }
};
