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
    },

    getHabitPerformance: async (days: number = 30): Promise<{ best: any[]; worst: any[] }> => {
        const db = getDB();

        // Calculate date range (last N days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        // Get all habits with their completion stats
        const habits = await db.getAllAsync<any>(
            `SELECT 
                h.id,
                h.name,
                h.icon,
                h.color,
                COUNT(CASE WHEN l.completed = 1 THEN 1 END) as completedDays,
                ? as totalDays
            FROM habits h
            LEFT JOIN logs l ON h.id = l.habit_id 
                AND l.date >= ? 
                AND l.date <= ?
            WHERE h.archived = 0
            GROUP BY h.id, h.name, h.icon, h.color
            HAVING completedDays > 0`,
            [days, startDateStr, endDateStr]
        );

        // Calculate completion rate
        const habitsWithRate = habits.map(habit => ({
            ...habit,
            completionRate: (habit.completedDays / habit.totalDays) * 100
        }));

        // Sort by completion rate
        const sorted = habitsWithRate.sort((a, b) => b.completionRate - a.completionRate);

        // Get top 3 best and bottom 3 worst
        const best = sorted.slice(0, 3);
        const worst = sorted.slice(-3).reverse();

        return { best, worst };
    }
};
