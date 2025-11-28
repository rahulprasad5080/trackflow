import { getDB } from './db';

export const analyticsService = {
    getMonthlyHeatmap: async (monthStart, monthEnd) => {
        const db = getDB();
        return await db.getAllAsync(
            `SELECT date, COUNT(*) as count 
       FROM logs 
       WHERE date >= ? AND date <= ? AND value > 0 
       GROUP BY date`,
            [monthStart, monthEnd]
        );
    },

    getHabitStats: async (habitId) => {
        const db = getDB();
        const total = await db.getFirstAsync(
            'SELECT COUNT(*) as count FROM logs WHERE habit_id = ? AND value > 0',
            [habitId]
        );
        return total;
    }
};
