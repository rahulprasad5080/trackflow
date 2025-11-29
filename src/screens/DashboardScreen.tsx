import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { CompletionStats } from '../components/CompletionStats';
import { HabitCard } from '../components/HabitCard';
import { HabitFilterChips } from '../components/HabitFilterChips';
import { HabitGridRow } from '../components/HabitGridRow';
import { ViewModeToggle } from '../components/ViewModeToggle';
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
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterId, setFilterId] = useState<number | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [weekLogs, setWeekLogs] = useState<Map<number, { date: string; completed: boolean }[]>>(new Map());
    const [streakData, setStreakData] = useState<{ current: number; best: number }>({ current: 0, best: 0 });
    const [chartData, setChartData] = useState<{ value: number; label: string; date: string }[]>([]);

    const today = getToday();

    // Generate last 7 days
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    };

    const loadData = async () => {
        const allHabits = await habitService.getHabits();
        setHabits(allHabits);

        // Load weekly logs for all habits
        const dates = getLast7Days();
        const logsMap = await habitService.getWeeklyLogsForAllHabits(dates);

        // Create week logs structure for each habit
        const habitWeekLogs = new Map<number, { date: string; completed: boolean }[]>();
        allHabits.forEach(habit => {
            const habitLogs = logsMap.get(habit.id);
            const weekData = dates.map(date => ({
                date,
                completed: habitLogs?.get(date)?.completed === 1 || false,
            }));
            habitWeekLogs.set(habit.id, weekData);
        });
        setWeekLogs(habitWeekLogs);

        // Calculate overall streak (using first habit for demo, can be enhanced)
        if (allHabits.length > 0) {
            const streak = await habitService.getStreak(allHabits[0].id);
            setStreakData(streak);
        }

        // Prepare chart data (total completions per day)
        const dailyCompletions = dates.map((date, index) => {
            let totalCompleted = 0;
            allHabits.forEach(habit => {
                const habitLogs = logsMap.get(habit.id);
                if (habitLogs?.get(date)?.completed === 1) {
                    totalCompleted++;
                }
            });
            const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayOfWeek = new Date(date).getDay();
            return {
                value: totalCompleted,
                label: dayLabels[dayOfWeek],
                date,
            };
        });
        setChartData(dailyCompletions);
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

    const handleToggleCompletion = async (habitId: number, date: string, completed: boolean) => {
        await habitService.toggleCompletion(habitId, date, completed);
        loadData(); // Refresh UI
    };

    const handleLog = async (habit: Habit) => {
        const newValue = (habit.value || 0) + 1;
        await habitService.logHabit(habit.id, today, newValue);
        loadData(); // Refresh UI
    };

    const filteredHabits = filterId
        ? habits.filter(h => h.id === filterId)
        : habits;

    // Calculate stats
    const weeklyTotal = habits.length * 7;
    const weeklyCompletions = Array.from(weekLogs.values()).reduce((sum, logs) => {
        return sum + logs.filter(log => log.completed).length;
    }, 0);
    const successRate = weeklyTotal > 0 ? Math.round((weeklyCompletions / weeklyTotal) * 100) : 0;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Stats Cards */}
                <CompletionStats
                    currentStreak={streakData.current}
                    bestStreak={streakData.best}
                    weeklyCompletions={weeklyCompletions}
                    weeklyTotal={weeklyTotal}
                    successRate={successRate}
                />

                {/* View Mode Toggle */}
                <View style={styles.toggleContainer}>
                    <ViewModeToggle mode={viewMode} onToggle={setViewMode} />
                </View>

                {/* Filter Chips */}
                <HabitFilterChips
                    habits={habits}
                    selectedId={filterId}
                    onSelect={setFilterId}
                />

                {/* Habits List/Grid */}
                <View style={styles.list}>
                    {viewMode === 'grid' ? (
                        filteredHabits.map(habit => (
                            <HabitGridRow
                                key={habit.id}
                                habit={habit}
                                weekLogs={weekLogs.get(habit.id) || []}
                                onToggle={handleToggleCompletion}
                            />
                        ))
                    ) : (
                        filteredHabits.map(habit => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                onLog={handleLog}
                                onDetail={() => navigation.navigate('HabitDetail', { habit })}
                            />
                        ))
                    )}
                </View>

                {/* Analytics Section */}
                {habits.length > 0 && (
                    <View style={styles.analyticsSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            📊 Analytics
                        </Text>
                        <AnalyticsChart
                            data={chartData}
                            title="Daily Completions (Last 7 Days)"
                            type="bar"
                            color="#8b5cf6"
                        />
                        <AnalyticsChart
                            data={chartData}
                            title="Completion Trend"
                            type="line"
                            color="#10b981"
                        />
                    </View>
                )}
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
    toggleContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    list: {
        paddingHorizontal: 16,
    },
    analyticsSection: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
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
