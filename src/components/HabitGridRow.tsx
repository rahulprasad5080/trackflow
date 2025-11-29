import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../constants/theme';
import { Habit } from '../types';
import { HabitCheckboxGrid } from './HabitCheckboxGrid';

interface HabitGridRowProps {
    habit: Habit;
    weekLogs: { date: string; completed: boolean }[];
    onToggle: (habitId: number, date: string, completed: boolean) => void;
}

export function HabitGridRow({ habit, weekLogs, onToggle }: HabitGridRowProps) {
    const { colors } = useTheme();

    // Calculate completion percentage for the week
    const completedCount = weekLogs.filter(log => log.completed).length;
    const completionRate = Math.round((completedCount / weekLogs.length) * 100);

    return (
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.leftSection}>
                <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
                    <Text style={styles.icon}>{habit.icon}</Text>
                </View>
                <View style={styles.habitInfo}>
                    <Text style={[styles.habitName, { color: colors.text }]} numberOfLines={1}>
                        {habit.name}
                    </Text>
                    <Text style={[styles.completionText, { color: colors.textSecondary }]}>
                        {completionRate}% this week
                    </Text>
                </View>
            </View>
            <View style={styles.rightSection}>
                <HabitCheckboxGrid
                    habitId={habit.id}
                    habitColor={habit.color}
                    weekLogs={weekLogs}
                    onToggle={onToggle}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 20,
    },
    habitInfo: {
        flex: 1,
    },
    habitName: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    completionText: {
        fontSize: 12,
        fontWeight: '500',
    },
    rightSection: {
        flexShrink: 0,
    },
});
