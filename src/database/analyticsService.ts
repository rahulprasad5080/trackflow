import { getDB } from './db';

export const analyticsService = {
    getMonthlyHeatmap: async (monthStart: string, monthEnd: string): Promise<{ date: string; count: number }[]> => {
        const db = getDB();
        return await db.getAllAsync<{ date: string; count: number }>(
            `SELECT date, COUNT(*) as count 
       FROM logs 
       WHERE date >= ? AND date <= ? AND value > 0 
       GROUP BY date`,
            [monthStart, monthEnd]
        );
    },

    getHabitStats: async (habitId: number): Promise<{ count: number } | null> => {
        const db = getDB();
        const total = await db.getFirstAsync<{ count: number }>(
            'SELECT COUNT(*) as count FROM logs WHERE habit_id = ? AND value > 0',
            [habitId]
        );
        return total;
    }
};
