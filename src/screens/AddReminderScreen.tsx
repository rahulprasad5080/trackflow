import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';
import { habitService } from '../database/habitService';
import { reminderService } from '../database/reminderService';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Habit } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddReminder'>;

export default function AddReminderScreen({ navigation }: Props) {
    const { colors } = useTheme();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
    const [time, setTime] = useState('');
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        loadHabits();
    }, []);

    const loadHabits = async () => {
        const data = await habitService.getHabits();
        setHabits(data);
        if (data.length > 0) {
            setSelectedHabitId(data[0].id);
        }
    };

    const toggleDay = (day: number) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleSave = async () => {
        setError('');

        if (!selectedHabitId) {
            setError('Please select a habit');
            return;
        }

        if (!time) {
            setError('Please enter a time');
            return;
        }

        // Basic validation for time format HH:MM
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(time)) {
            setError('Please enter time in HH:MM format (e.g., 08:00)');
            return;
        }

        try {
            await reminderService.addReminder(
                selectedHabitId,
                time,
                selectedDays.length > 0 ? selectedDays : [1, 2, 3, 4, 5, 6, 7], // Default to all days if none selected
                Date.now().toString() // Simple ID for now
            );

            navigation.goBack();
        } catch (e) {
            setError('Failed to save reminder. Please try again.');
            console.error('Error saving reminder:', e);
        }
    };

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.form}>
                <Text style={[styles.label, { color: colors.text }]}>Select Habit</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.habitList}>
                    {habits.map(habit => (
                        <TouchableOpacity
                            key={habit.id}
                            style={[
                                styles.habitChip,
                                {
                                    backgroundColor: selectedHabitId === habit.id ? colors.tint : colors.card,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => setSelectedHabitId(habit.id)}
                        >
                            <Text
                                style={[
                                    styles.habitChipText,
                                    { color: selectedHabitId === habit.id ? '#FFF' : colors.text }
                                ]}
                            >
                                {habit.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={[styles.label, { color: colors.text }]}>Time (24h)</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                    placeholder="e.g. 08:00"
                    placeholderTextColor={colors.textSecondary}
                    value={time}
                    onChangeText={setTime}
                    maxLength={5}
                />

                <Text style={[styles.label, { color: colors.text }]}>Days</Text>
                <View style={styles.daysContainer}>
                    {days.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dayChip,
                                {
                                    backgroundColor: selectedDays.includes(index + 1) ? colors.tint : colors.card,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => toggleDay(index + 1)}
                        >
                            <Text
                                style={[
                                    styles.dayText,
                                    { color: selectedDays.includes(index + 1) ? '#FFF' : colors.text }
                                ]}
                            >
                                {day}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {error ? (
                    <View style={[styles.errorContainer, { backgroundColor: colors.danger + '20', borderColor: colors.danger }]}>
                        <Ionicons name="alert-circle" size={20} color={colors.danger} />
                        <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
                    </View>
                ) : null}

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.tint }]}
                    onPress={handleSave}
                >
                    <Text style={styles.buttonText}>Set Reminder</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        marginTop: 16,
    },
    input: {
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    habitList: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    habitChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    habitChipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    dayChip: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    dayText: {
        fontSize: 12,
        fontWeight: '600',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        borderWidth: 1,
    },
    errorText: {
        fontSize: 14,
        flex: 1,
    },
    button: {
        marginTop: 32,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
