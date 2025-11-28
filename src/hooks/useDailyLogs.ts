import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { habitService } from '../database/habitService';
import { Habit } from '../types';

export const useDailyLogs = (date: string) => {
    const [logs, setLogs] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await habitService.getDailyLogs(date);
            setLogs(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchLogs();
        }, [date])
    );

    return { logs, loading, refreshLogs: fetchLogs };
};
