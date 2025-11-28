import { Reminder } from '../types';
import { getDB } from './db';

export const reminderService = {
    addReminder: async (habitId: number, time: string, days: number[], notificationId: string): Promise<void> => {
        const db = getDB();
        await db.runAsync(
            'INSERT INTO reminders (habit_id, time, days, notification_id, enabled) VALUES (?, ?, ?, ?, 1)',
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
            days: JSON.parse(r.days),
            enabled: !!r.enabled
        }));
    },

    getAllReminders: async (): Promise<Reminder[]> => {
        const db = getDB();
        const reminders = await db.getAllAsync<any>(
            `SELECT r.*, h.name as habitName 
             FROM reminders r 
             JOIN habits h ON r.habit_id = h.id`
        );
        return reminders.map(r => ({
            ...r,
            days: JSON.parse(r.days),
            enabled: !!r.enabled
        }));
    },

    toggleReminder: async (id: number, enabled: boolean): Promise<void> => {
        const db = getDB();
        await db.runAsync(
            'UPDATE reminders SET enabled = ? WHERE id = ?',
            [enabled ? 1 : 0, id]
        );
    },

    deleteReminder: async (id: number): Promise<void> => {
        const db = getDB();
        await db.runAsync('DELETE FROM reminders WHERE id = ?', [id]);
    }
};
