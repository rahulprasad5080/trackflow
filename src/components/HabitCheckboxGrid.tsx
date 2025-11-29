import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';

interface HabitCheckboxGridProps {
    habitId: number;
    habitColor: string;
    weekLogs: { date: string; completed: boolean }[];
    onToggle: (habitId: number, date: string, completed: boolean) => void;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function HabitCheckboxGrid({ habitId, habitColor, weekLogs, onToggle }: HabitCheckboxGridProps) {
    const { colors } = useTheme();

    const handleToggle = (date: string, currentCompleted: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle(habitId, date, !currentCompleted);
    };

    return (
        <View style={styles.container}>
            {weekLogs.map((log, index) => {
                const isCompleted = log.completed;
                return (
                    <View key={log.date} style={styles.dayContainer}>
                        <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>
                            {DAYS[index]}
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.checkbox,
                                {
                                    backgroundColor: isCompleted ? habitColor : colors.surface,
                                    borderColor: isCompleted ? habitColor : colors.border,
                                },
                            ]}
                            onPress={() => handleToggle(log.date, isCompleted)}
                            activeOpacity={0.7}
                        >
                            {isCompleted && (
                                <Ionicons name="checkmark" size={16} color="#FFF" />
                            )}
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    dayContainer: {
        alignItems: 'center',
        gap: 4,
    },
    dayLabel: {
        fontSize: 10,
        fontWeight: '600',
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 8,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
