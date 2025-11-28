import { endOfMonth, format, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { analyticsService } from '../database/analyticsService';

export const useHeatmapData = (currentDate) => {
    const [heatmapData, setHeatmapData] = useState([]);

    useEffect(() => {
        loadData();
    }, [currentDate]);

    const loadData = async () => {
        const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
        const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');
        const data = await analyticsService.getMonthlyHeatmap(start, end);
        setHeatmapData(data);
    };

    return heatmapData;
};
