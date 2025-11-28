import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';
import { Reminder } from '../types';

export default function RemindersScreen() {
    const { colors } = useTheme();
    const [reminders, setReminders] = useState<Reminder[]>([]);

    const loadReminders = async () => {
        // In a real app, we'd fetch all reminders across habits
        // For now, mocking or fetching for a specific habit
        // const data = await reminderService.getReminders(1); 
        // setReminders(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadReminders();
        }, [])
    );

    const toggleReminder = (id: number) => {
        // Logic to toggle reminder
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={reminders}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View>
                            <Text style={[styles.time, { color: colors.text }]}>{item.time}</Text>
                            <Text style={[styles.habit, { color: colors.textSecondary }]}>{item.habitName}</Text>
                        </View>
                        <Switch
                            value={item.enabled}
                            onValueChange={() => toggleReminder(item.id)}
                            trackColor={{ false: colors.border, true: colors.tint }}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={[styles.empty, { color: colors.textSecondary }]}>No reminders set</Text>
                }
            />

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.tint }]}
            // onPress={() => navigation.navigate('AddReminder')}
            >
                <Ionicons name="alarm" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    time: {
        fontSize: 18,
        fontWeight: '600',
    },
    habit: {
        fontSize: 14,
    },
    empty: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
});
