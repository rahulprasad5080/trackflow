import { getDB } from './db';

export const streakService = {
    getCurrentStreak: async (habitId: number): Promise<number> => {
        const db = getDB();
        // This is a simplified streak calculation. 
        // Real implementation would need recursive query or fetching all logs.
        const logs = await db.getAllAsync(
            'SELECT date FROM logs WHERE habit_id = ? AND value > 0 ORDER BY date DESC',
            [habitId]
        );

        let streak = 0;
        // Logic to calculate consecutive days would go here
        // For now returning mock
        return logs.length;
    }
};
