import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HeatSquare } from '../components/HeatSquare';
import { MonthSwitcher } from '../components/MonthSwitcher';
import { useTheme } from '../constants/theme';
import { useHeatmapData } from '../hooks/useHeatmapData';
import { getHeatmapColor } from '../utils/colorUtils';
import { getMonthDays, getNextMonth, getPreviousMonth, isSameDate } from '../utils/dateUtils';

export default function AnalyticsScreen() {
    const { colors, theme } = useTheme();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const heatmapData = useHeatmapData(currentMonth);
    const days = getMonthDays(currentMonth);

    const getCountForDay = (date: Date) => {
        const found = heatmapData.find(d => isSameDate(d.date, date));
        return found ? found.count : 0;
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>Activity Heatmap</Text>

                <MonthSwitcher
                    currentMonth={currentMonth}
                    onPrev={() => setCurrentMonth(getPreviousMonth(currentMonth))}
                    onNext={() => setCurrentMonth(getNextMonth(currentMonth))}
                />

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
    heatmapGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        justifyContent: 'center',
    },
});
