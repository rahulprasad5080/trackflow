import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../constants/theme';
import { getHeatmapColor } from '../utils/colorUtils';

interface CalendarProps {
    days: Date[];
    getCountForDay: (date: Date) => number;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function Calendar({ days, getCountForDay }: CalendarProps) {
    const { colors, theme } = useTheme();

    // Get the first day of the month to calculate offset
    const firstDay = days[0];
    const dayOfWeek = firstDay.getDay();
    // Convert Sunday (0) to 6, and shift Monday to 0
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Create empty cells for offset
    const emptyCells = Array(offset).fill(null);
    const allCells = [...emptyCells, ...days];

    return (
        <View style={styles.calendarContainer}>
            {/* Day headers */}
            <View style={styles.weekRow}>
                {DAYS_OF_WEEK.map((day) => (
                    <View key={day} style={styles.dayHeader}>
                        <Text style={[styles.dayHeaderText, { color: colors.textSecondary }]}>
                            {day}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Calendar grid */}
            <View style={styles.calendarGrid}>
                {allCells.map((day, index) => {
                    if (!day) {
                        // Empty cell for offset
                        return <View key={`empty-${index}`} style={styles.dayCell} />;
                    }

                    const count = getCountForDay(day);
                    const backgroundColor = getHeatmapColor(count, theme);
                    const dayNumber = day.getDate();
                    const isToday = new Date().toDateString() === day.toDateString();

                    return (
                        <View
                            key={index}
                            style={[
                                styles.dayCell,
                                { backgroundColor },
                                isToday && styles.todayCell,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.dayNumber,
                                    { color: count > 0 ? '#FFFFFF' : colors.text },
                                    isToday && styles.todayText,
                                ]}
                            >
                                {dayNumber}
                            </Text>
                            {count > 0 && (
                                <View style={styles.countBadge}>
                                    <Text style={styles.countText}>{count}</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    calendarContainer: {
        marginTop: 16,
    },
    weekRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    dayHeader: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    dayHeaderText: {
        fontSize: 12,
        fontWeight: '600',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%', // 100% / 7 days
        aspectRatio: 1,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 4,
        position: 'relative',
    },
    todayCell: {
        borderWidth: 2,
        borderColor: '#4A90E2',
    },
    dayNumber: {
        fontSize: 14,
        fontWeight: '600',
    },
    todayText: {
        fontWeight: 'bold',
    },
    countBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    countText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
