import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';

export default function RemindersScreen() {
    const { colors } = useTheme();
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        loadReminders();
    }, []);

    const loadReminders = async () => {
        // Mock for now, would fetch from DB
        setReminders([
            { id: 1, habitName: 'Drink Water', time: '09:00 AM', enabled: true },
            { id: 2, habitName: 'Exercise', time: '06:00 PM', enabled: false },
        ]);
    };

    const toggleReminder = (id) => {
        setReminders(prev => prev.map(r =>
            r.id === id ? { ...r, enabled: !r.enabled } : r
        ));
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={reminders}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View>
                            <Text style={[styles.habitName, { color: colors.text }]}>{item.habitName}</Text>
                            <Text style={[styles.time, { color: colors.textSecondary }]}>{item.time}</Text>
                        </View>
                        <Switch
                            value={item.enabled}
                            onValueChange={() => toggleReminder(item.id)}
                            trackColor={{ true: colors.tint }}
                        />
                    </View>
                )}
                contentContainerStyle={styles.list}
            />

            <TouchableOpacity style={[styles.fab, { backgroundColor: colors.tint }]}>
                <Ionicons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: 16,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    habitName: {
        fontSize: 16,
        fontWeight: '600',
    },
    time: {
        fontSize: 14,
        marginTop: 4,
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
