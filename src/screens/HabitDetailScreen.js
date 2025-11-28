import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HeatSquare } from '../components/HeatSquare';
import { WeeklyBarChart } from '../components/WeeklyBarChart';
import { useTheme } from '../constants/theme';
import { getMonthDays } from '../utils/dateUtils';

export default function HabitDetailScreen({ route }) {
    const { habit } = route.params;
    const { colors } = useTheme();
    const [stats, setStats] = useState(null);

    // Mock data for charts
    const weeklyData = [
        { day: 'M', value: 5 },
        { day: 'T', value: 8 },
        { day: 'W', value: 2 },
        { day: 'T', value: 6 },
        { day: 'F', value: 9 },
        { day: 'S', value: 4 },
        { day: 'S', value: 7 },
    ];

    const monthDays = getMonthDays();

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>{habit.name}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Goal: {habit.goal} {habit.unit}
                </Text>
            </View>

            <View style={[styles.section, { backgroundColor: colors.card }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Progress</Text>
                <WeeklyBarChart data={weeklyData} />
            </View>

            <View style={[styles.section, { backgroundColor: colors.card }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Monthly Heatmap</Text>
                <View style={styles.heatmap}>
                    {monthDays.map((day, i) => (
                        <HeatSquare key={i} value={Math.floor(Math.random() * 5)} size={16} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        marginTop: 8,
    },
    section: {
        margin: 16,
        padding: 16,
        borderRadius: 16,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    heatmap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
});
