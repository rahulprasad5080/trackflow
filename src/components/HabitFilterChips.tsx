import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/theme';
import { Habit } from '../types';

interface HabitFilterChipsProps {
    habits: Habit[];
    selectedId: number | null;
    onSelect: (id: number | null) => void;
}

export const HabitFilterChips = ({ habits, selectedId, onSelect }: HabitFilterChipsProps) => {
    const { colors } = useTheme();

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <TouchableOpacity
                style={[
                    styles.chip,
                    {
                        backgroundColor: selectedId === null ? colors.tint : colors.surface,
                        borderColor: colors.border
                    }
                ]}
                onPress={() => onSelect(null)}
            >
                <Text style={{ color: selectedId === null ? '#FFF' : colors.text }}>All</Text>
            </TouchableOpacity>

            {habits.map(habit => (
                <TouchableOpacity
                    key={habit.id}
                    style={[
                        styles.chip,
                        {
                            backgroundColor: selectedId === habit.id ? habit.color : colors.surface,
                            borderColor: colors.border
                        }
                    ]}
                    onPress={() => onSelect(habit.id === selectedId ? null : habit.id)}
                >
                    <Text style={{ color: selectedId === habit.id ? '#FFF' : colors.text }}>
                        {habit.icon} {habit.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        gap: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
    },
});
