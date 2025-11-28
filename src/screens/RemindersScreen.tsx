import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';
import { reminderService } from '../database/reminderService';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Reminder } from '../types';
import { cancelNotification } from '../utils/notificationManager';

export default function RemindersScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [reminders, setReminders] = useState<Reminder[]>([]);

    const loadReminders = async () => {
        const data = await reminderService.getAllReminders();
        setReminders(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadReminders();
        }, [])
    );

    const toggleReminder = async (id: number, currentValue: boolean) => {
        const reminder = reminders.find(r => r.id === id);
        if (reminder && currentValue) {
            // If turning off, cancel the notification
            await cancelNotification(reminder.notification_id);
        }
        await reminderService.toggleReminder(id, !currentValue);
        loadReminders();
    };

    const deleteReminder = async (id: number) => {
        const reminder = reminders.find(r => r.id === id);
        if (reminder) {
            // Cancel the notification before deleting
            await cancelNotification(reminder.notification_id);
        }
        await reminderService.deleteReminder(id);
        loadReminders();
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={reminders}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.itemContent}>
                            <Text style={[styles.time, { color: colors.text }]}>{item.time}</Text>
                            <Text style={[styles.habit, { color: colors.textSecondary }]}>{item.habitName}</Text>
                            <View style={styles.daysContainer}>
                                {item.days.map(d => (
                                    <Text key={d} style={[styles.dayText, { color: colors.textSecondary }]}>
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d - 1]}
                                    </Text>
                                ))}
                            </View>
                        </View>
                        <View style={styles.actions}>
                            <Switch
                                value={item.enabled}
                                onValueChange={() => toggleReminder(item.id, !!item.enabled)}
                                trackColor={{ false: colors.border, true: colors.tint }}
                            />
                            <TouchableOpacity onPress={() => deleteReminder(item.id)} style={styles.deleteBtn}>
                                <Ionicons name="trash-outline" size={20} color={colors.danger} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={[styles.empty, { color: colors.textSecondary }]}>No reminders set</Text>
                }
            />

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.tint }]}
                onPress={() => navigation.navigate('AddReminder')}
            >
                <Ionicons name="add" size={24} color="#FFF" />
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
    itemContent: {
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    time: {
        fontSize: 18,
        fontWeight: '600',
    },
    habit: {
        fontSize: 14,
        marginTop: 4,
    },
    daysContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
    },
    dayText: {
        fontSize: 12,
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
    deleteBtn: {
        padding: 4,
    }
});
