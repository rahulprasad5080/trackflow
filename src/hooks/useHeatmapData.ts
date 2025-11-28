import { useFocusEffect } from '@react-navigation/native';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { useCallback, useState } from 'react';
import { analyticsService } from '../database/analyticsService';

export const useHeatmapData = (currentMonth: Date) => {
    const [heatmapData, setHeatmapData] = useState<{ date: string; count: number }[]>([]);

    const fetchData = async () => {
        const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
        const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
        const data = await analyticsService.getMonthlyHeatmap(start, end);
        setHeatmapData(data);
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [currentMonth])
    );

    return heatmapData;
};
