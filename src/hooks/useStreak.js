import { useEffect, useState } from 'react';
import { streakService } from '../database/streakService';

export const useStreak = (habitId) => {
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        loadStreak();
    }, [habitId]);

    const loadStreak = async () => {
        const s = await streakService.getCurrentStreak(habitId);
        setStreak(s);
    };

    return streak;
};
