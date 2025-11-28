import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { HabitCard } from '../components/HabitCard';
import { HabitFilterChips } from '../components/HabitFilterChips';
import { SummaryCard } from '../components/SummaryCard';
import { useTheme } from '../constants/theme';
import { habitService } from '../database/habitService';
import { RootStackParamList, TabParamList } from '../navigation/AppNavigator';
import { Habit } from '../types';
import { getToday } from '../utils/dateUtils';

type Props = CompositeScreenProps<
    BottomTabScreenProps<TabParamList, 'Dashboard'>,
    NativeStackScreenProps<RootStackParamList>
>;

export default function DashboardScreen({ navigation }: Props) {
    const { colors } = useTheme();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [filterId, setFilterId] = useState<number | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const today = getToday();

    const loadData = async () => {
        const allHabits = await habitService.getHabits();
        const dailyLogs = await habitService.getDailyLogs(today);

        // Merge logs into habits
        const merged = allHabits.map(h => {
            const log = dailyLogs.find(l => l.id === h.id);
            return { ...h, ...log, value: log?.value || 0, completed: log?.completed || 0 };
        });

        setHabits(merged);
        setLogs(dailyLogs);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleLog = async (habit: Habit) => {
        const newValue = (habit.value || 0) + 1;
        await habitService.logHabit(habit.id, today, newValue);
        loadData(); // Refresh UI
    };

    const filteredHabits = filterId
        ? habits.filter(h => h.id === filterId)
        : habits;

    const completedCount = habits.filter(h => h.completed).length;
    const totalCount = habits.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.summaryContainer}>
                    <SummaryCard title="Today's Score" value={`${progress}%`} subtitle={`${completedCount}/${totalCount} Done`} />
                    <SummaryCard title="Current Streak" value="5 Days" subtitle="Best: 12 Days" />
                </View>

                <HabitFilterChips
                    habits={habits}
                    selectedId={filterId}
                    onSelect={setFilterId}
                />

                <View style={styles.list}>
                    {filteredHabits.map(habit => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onLog={handleLog}
                            onDetail={() => navigation.navigate('HabitDetail', { habit })}
                        />
                    ))}
                </View>
            </ScrollView>

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.tint }]}
                onPress={() => navigation.navigate('AddHabit')}
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
    content: {
        paddingVertical: 16,
        paddingBottom: 80, // Add padding for FAB
    },
    summaryContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 24,
    },
    list: {
        paddingHorizontal: 16,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
