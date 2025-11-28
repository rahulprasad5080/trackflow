import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';
import { Habit } from '../types';

interface HabitCardProps {
    habit: Habit;
    onLog: (habit: Habit) => void;
    onDetail: (habit: Habit) => void;
}

export const HabitCard = ({ habit, onLog, onDetail }: HabitCardProps) => {
    const { colors } = useTheme();
    const isCompleted = habit.completed === 1;

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => onDetail(habit)}
        >
            <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
                <Text style={{ fontSize: 24 }}>{habit.icon}</Text>
            </View>

            <View style={styles.info}>
                <Text style={[styles.title, { color: colors.text }]}>{habit.name}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    {habit.value} / {habit.goal} {habit.unit}
                </Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    { backgroundColor: isCompleted ? colors.secondary : colors.tint }
                ]}
                onPress={() => onLog(habit)}
            >
                <Ionicons
                    name={isCompleted ? "checkmark" : "add"}
                    size={24}
                    color="#FFF"
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
