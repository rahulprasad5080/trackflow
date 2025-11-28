import { Reminder } from '../types';
import { getDB } from './db';

export const reminderService = {
    addReminder: async (habitId: number, time: string, days: number[], notificationId: string): Promise<void> => {
        const db = getDB();
        await db.runAsync(
            'INSERT INTO reminders (habit_id, time, days, notification_id) VALUES (?, ?, ?, ?)',
            [habitId, time, JSON.stringify(days), notificationId]
        );
    },

    getReminders: async (habitId: number): Promise<Reminder[]> => {
        const db = getDB();
        const reminders = await db.getAllAsync<any>(
            'SELECT * FROM reminders WHERE habit_id = ?',
            [habitId]
        );
        return reminders.map(r => ({
            ...r,
            days: JSON.parse(r.days)
        }));
    },

    deleteReminder: async (id: number): Promise<void> => {
        const db = getDB();
        await db.runAsync('DELETE FROM reminders WHERE id = ?', [id]);
    }
};
