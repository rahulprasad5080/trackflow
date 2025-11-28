import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { streakService } from '../database/streakService';

export const useStreak = (habitId: number) => {
    const [streak, setStreak] = useState<number>(0);

    const fetchStreak = async () => {
        const current = await streakService.getCurrentStreak(habitId);
        setStreak(current);
    };

    useFocusEffect(
        useCallback(() => {
            fetchStreak();
        }, [habitId])
    );

    return streak;
};
