import { getDB } from './db';

export const habitService = {
    createHabit: async (habit) => {
        const db = getDB();
        const result = await db.runAsync(
            'INSERT INTO habits (name, icon, color, goal, unit) VALUES (?, ?, ?, ?, ?)',
            [habit.name, habit.icon, habit.color, habit.goal, habit.unit]
        );
        return result.lastInsertRowId;
    },

    getHabits: async () => {
        const db = getDB();
        return await db.getAllAsync('SELECT * FROM habits WHERE archived = 0');
    },

    updateHabit: async (id, updates) => {
        const db = getDB();
        // Simplified update for now
        await db.runAsync(
            'UPDATE habits SET name = ?, icon = ?, color = ?, goal = ?, unit = ? WHERE id = ?',
            [updates.name, updates.icon, updates.color, updates.goal, updates.unit, id]
        );
    },

    deleteHabit: async (id) => {
        const db = getDB();
        await db.runAsync('UPDATE habits SET archived = 1 WHERE id = ?', [id]);
    },

    logHabit: async (habitId, date, value) => {
        const db = getDB();
        // Check if log exists
        const existing = await db.getFirstAsync(
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

    getDailyLogs: async (date) => {
        const db = getDB();
        return await db.getAllAsync(
            `SELECT h.*, l.value, l.completed 
       FROM habits h 
       LEFT JOIN logs l ON h.id = l.habit_id AND l.date = ? 
       WHERE h.archived = 0`,
            [date]
        );
    }
};
