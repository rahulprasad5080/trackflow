import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Calendar } from '../components/Calendar';
import { HeatSquare } from '../components/HeatSquare';
import { MonthSwitcher } from '../components/MonthSwitcher';
import { useTheme } from '../constants/theme';
import { analyticsService } from '../database/analyticsService';
import { useHeatmapData } from '../hooks/useHeatmapData';
import { HabitPerformance } from '../types';
import { getHeatmapColor } from '../utils/colorUtils';
import { getMonthDays, getNextMonth, getPreviousMonth, isSameDate } from '../utils/dateUtils';

export default function AnalyticsScreen() {
    const { colors, theme } = useTheme();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const heatmapData = useHeatmapData(currentMonth);
    const days = getMonthDays(currentMonth);
    const [bestHabits, setBestHabits] = useState<HabitPerformance[]>([]);
    const [worstHabits, setWorstHabits] = useState<HabitPerformance[]>([]);

    // Load performance data
    useFocusEffect(
        React.useCallback(() => {
            loadPerformanceData();
        }, [])
    );

    const loadPerformanceData = async () => {
        try {
            const { best, worst } = await analyticsService.getHabitPerformance(30);
            setBestHabits(best);
            setWorstHabits(worst);
        } catch (error) {
            console.error('Error loading performance data:', error);
        }
    };

    const getCountForDay = (date: Date) => {
        const found = heatmapData.find(d => isSameDate(d.date, date));
        return found ? found.count : 0;
    };



    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <MonthSwitcher
                    currentMonth={currentMonth}
                    onPrev={() => setCurrentMonth(getPreviousMonth(currentMonth))}
                    onNext={() => setCurrentMonth(getNextMonth(currentMonth))}
                />

                <Calendar days={days} getCountForDay={getCountForDay} />

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Heatmap Grid</Text>

                <View style={styles.heatmapGrid}>
                    {days.map((day, index) => {
                        const count = getCountForDay(day);
                        return (
                            <HeatSquare
                                key={index}
                                color={getHeatmapColor(count, theme)}
                                size={32}
                            />
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 12,
    },
    heatmapGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        justifyContent: 'center',
    },

    performanceSection: {
        marginBottom: 8,
    },
});
