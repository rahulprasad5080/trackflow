import { useCallback, useEffect, useState } from 'react';
import { habitService } from '../database/habitService';

export const useDailyLogs = (date) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadLogs = useCallback(async () => {
        setLoading(true);
        try {
            const data = await habitService.getDailyLogs(date);
            setLogs(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    return { logs, loading, refresh: loadLogs };
};
