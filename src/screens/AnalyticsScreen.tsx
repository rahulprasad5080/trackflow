import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Calendar } from '../components/Calendar';
import { HabitPerformanceCard } from '../components/HabitPerformanceCard';
import { HeatSquare } from '../components/HeatSquare';
import { MonthSwitcher } from '../components/MonthSwitcher';
import { useTheme } from '../constants/theme';
import { analyticsService } from '../database/analyticsService';
import { useHeatmapData } from '../hooks/useHeatmapData';
import { HabitPerformance } from '../types';
import { getHeatmapColor } from '../utils/colorUtils';
import { getMonthDays, getNextMonth, getPreviousMonth, isSameDate } from '../utils/dateUtils';

export default function AnalyticsScreen() {
    const { colors, theme } = useTheme();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const heatmapData = useHeatmapData(currentMonth);
    const days = getMonthDays(currentMonth);
    const [bestHabits, setBestHabits] = useState<HabitPerformance[]>([]);
    const [worstHabits, setWorstHabits] = useState<HabitPerformance[]>([]);

    // Load performance data
    useFocusEffect(
        React.useCallback(() => {
            loadPerformanceData();
        }, [])
    );

    const loadPerformanceData = async () => {
        try {
            const { best, worst } = await analyticsService.getHabitPerformance(30);
            setBestHabits(best);
            setWorstHabits(worst);
        } catch (error) {
            console.error('Error loading performance data:', error);
        }
    };

    const getCountForDay = (date: Date) => {
        const found = heatmapData.find(d => isSameDate(d.date, date));
        return found ? found.count : 0;
    };

    // Mock data for the chart
    const lineData = [
        { value: 320, label: 'M' },
        { value: 280, label: 'T' },
        { value: 290, label: 'W' },
        { value: 450, label: 'T' }, // Peak
        { value: 380, label: 'F' },
        { value: 120, label: 'S' },
        { value: 200, label: 'S' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>

                <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
                    <View style={styles.chartHeader}>
                        <Text style={[styles.chartTitle, { color: colors.text }]}>Weekly Progress</Text>
                        <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>15 April - 21 April</Text>
                    </View>

                    <LineChart
                        areaChart
                        curved
                        data={lineData}
                        height={200}
                        spacing={44}
                        initialSpacing={20}
                        color1="#007AFF"
                        startFillColor1="#007AFF"
                        endFillColor1="#FFFFFF"
                        startOpacity={0.8}
                        endOpacity={0.1}
                        hideDataPoints={false}
                        dataPointsColor="#007AFF"
                        dataPointsRadius={4}
                        thickness={2}
                        hideRules
                        hideYAxisText
                        yAxisColor="transparent"
                        xAxisColor="transparent"
                        xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 12 }}
                        pointerConfig={{
                            pointerStripHeight: 160,
                            pointerStripColor: 'lightgray',
                            pointerStripWidth: 2,
                            pointerColor: 'lightgray',
                            radius: 6,
                            pointerLabelWidth: 100,
                            pointerLabelHeight: 90,
                            activatePointersOnLongPress: false,
                            autoAdjustPointerLabelPosition: false,
                            pointerLabelComponent: (items: any) => {
                                return (
                                    <View
                                        style={{
                                            height: 90,
                                            width: 100,
                                            justifyContent: 'center',
                                            marginTop: -30,
                                            marginLeft: -40,
                                        }}>
                                        <View style={{ padding: 6, borderRadius: 8, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                                            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: '#000' }}>{items[0].value}</Text>
                                            <Text style={{ fontSize: 10, textAlign: 'center', color: 'gray' }}>additional text</Text>
                                        </View>
                                    </View>
                                );
                            },
                        }}
                    />
                </View>

                {/* Best Performing Habits */}
                {bestHabits.length > 0 && (
                    <>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>🏆 Best Performing Habit</Text>
                        <View style={styles.performanceSection}>
                            {bestHabits.slice(0, 1).map((habit) => (
                                <HabitPerformanceCard
                                    key={habit.id}
                                    name={habit.name}
                                    icon={habit.icon}
                                    color={habit.color}
                                    completionRate={habit.completionRate}
                                    completedDays={habit.completedDays}
                                    totalDays={habit.totalDays}
                                    variant="best"
                                />
                            ))}
                        </View>
                    </>
                )}

                {/* Worst Performing Habits */}
                {worstHabits.length > 0 && (bestHabits.length === 0 || worstHabits[0].id !== bestHabits[0].id) && (
                    <>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>📊 Needs Improvement</Text>
                        <View style={styles.performanceSection}>
                            {worstHabits.slice(0, 1).map((habit) => (
                                <HabitPerformanceCard
                                    key={habit.id}
                                    name={habit.name}
                                    icon={habit.icon}
                                    color={habit.color}
                                    completionRate={habit.completionRate}
                                    completedDays={habit.completedDays}
                                    totalDays={habit.totalDays}
                                    variant="worst"
                                />
                            ))}
                        </View>
                    </>
                )}

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Activity Calendar</Text>

                <MonthSwitcher
                    currentMonth={currentMonth}
                    onPrev={() => setCurrentMonth(getPreviousMonth(currentMonth))}
                    onNext={() => setCurrentMonth(getNextMonth(currentMonth))}
                />

                <Calendar days={days} getCountForDay={getCountForDay} />

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Heatmap Grid</Text>

                <View style={styles.heatmapGrid}>
                    {days.map((day, index) => {
                        const count = getCountForDay(day);
                        return (
                            <HeatSquare
                                key={index}
                                color={getHeatmapColor(count, theme)}
                                size={32}
                            />
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 12,
    },
    heatmapGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        justifyContent: 'center',
    },
    chartCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    chartHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    chartSubtitle: {
        fontSize: 14,
    },
    performanceSection: {
        marginBottom: 8,
    },
});
