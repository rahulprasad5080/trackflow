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
    },

    // Get logs for a specific habit over a date range
    getHabitLogs: async (habitId: number, startDate: string, endDate: string): Promise<Log[]> => {
        const db = getDB();
        return await db.getAllAsync<Log>(
            `SELECT * FROM logs 
             WHERE habit_id = ? AND date >= ? AND date <= ?
             ORDER BY date ASC`,
            [habitId, startDate, endDate]
        );
    },

    // Get weekly logs for all habits
    getWeeklyLogsForAllHabits: async (dates: string[]): Promise<Map<number, Map<string, Log>>> => {
        const db = getDB();
        const placeholders = dates.map(() => '?').join(',');
        const logs = await db.getAllAsync<Log>(
            `SELECT * FROM logs WHERE date IN (${placeholders})`,
            dates
        );

        // Organize logs by habit_id and date
        const logMap = new Map<number, Map<string, Log>>();
        logs.forEach(log => {
            if (!logMap.has(log.habit_id)) {
                logMap.set(log.habit_id, new Map());
            }
            logMap.get(log.habit_id)!.set(log.date, log);
        });

        return logMap;
    },

    // Calculate streak for a habit
    getStreak: async (habitId: number): Promise<{ current: number; best: number }> => {
        const db = getDB();
        const logs = await db.getAllAsync<Log>(
            `SELECT date, completed FROM logs 
             WHERE habit_id = ? AND completed = 1
             ORDER BY date DESC`,
            [habitId]
        );

        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < logs.length; i++) {
            const logDate = new Date(logs[i].date);
            logDate.setHours(0, 0, 0, 0);

            if (i === 0) {
                const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
                if (daysDiff <= 1) {
                    currentStreak = 1;
                    tempStreak = 1;
                }
            } else {
                const prevDate = new Date(logs[i - 1].date);
                prevDate.setHours(0, 0, 0, 0);
                const daysDiff = Math.floor((prevDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

                if (daysDiff === 1) {
                    tempStreak++;
                    if (i === 1 || currentStreak > 0) {
                        currentStreak = tempStreak;
                    }
                } else {
                    tempStreak = 1;
                }
            }

            bestStreak = Math.max(bestStreak, tempStreak);
        }

        return { current: currentStreak, best: bestStreak };
    },

    // Toggle completion status for a specific date
    toggleCompletion: async (habitId: number, date: string, completed: boolean): Promise<void> => {
        const db = getDB();
        const existing = await db.getFirstAsync<Log>(
            'SELECT * FROM logs WHERE habit_id = ? AND date = ?',
            [habitId, date]
        );

        if (existing) {
            await db.runAsync(
                'UPDATE logs SET completed = ? WHERE id = ?',
                [completed ? 1 : 0, existing.id]
            );
        } else {
            await db.runAsync(
                'INSERT INTO logs (habit_id, date, value, completed) VALUES (?, ?, ?, ?)',
                [habitId, date, completed ? 1 : 0, completed ? 1 : 0]
            );
        }
    },
};
