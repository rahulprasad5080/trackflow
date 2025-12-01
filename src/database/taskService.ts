import { Task } from '../types';
import { getDB } from './db';

export const getTasks = async (): Promise<Task[]> => {
    const db = getDB();
    const tasks = await db.getAllAsync<Task>('SELECT * FROM tasks ORDER BY completed ASC, created_at DESC');
    return tasks;
};

export const addTask = async (text: string): Promise<Task> => {
    const db = getDB();
    const result = await db.runAsync('INSERT INTO tasks (text) VALUES (?)', text);
    return {
        id: result.lastInsertRowId,
        text,
        completed: 0,
        created_at: new Date().toISOString(),
    };
};

export const toggleTaskCompletion = async (id: number, completed: boolean): Promise<void> => {
    const db = getDB();
    await db.runAsync('UPDATE tasks SET completed = ? WHERE id = ?', completed ? 1 : 0, id);
};

export const deleteTask = async (id: number): Promise<void> => {
    const db = getDB();
    await db.runAsync('DELETE FROM tasks WHERE id = ?', id);
};
