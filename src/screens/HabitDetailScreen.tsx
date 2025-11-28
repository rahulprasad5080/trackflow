import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProgressRing } from '../components/ProgressRing';
import { WeeklyBarChart } from '../components/WeeklyBarChart';
import { useTheme } from '../constants/theme';
import { useStreak } from '../hooks/useStreak';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'HabitDetail'>;

export default function HabitDetailScreen({ route }: Props) {
    const { habit } = route.params;
    const { colors } = useTheme();
    const streak = useStreak(habit.id);

    // Mock data for charts
    const weeklyData = [
        { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <ProgressRing progress={(habit.value || 0) / habit.goal} size={120} />
                <Text style={[styles.title, { color: colors.text }]}>{habit.name}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Current Streak: {streak} days
                </Text>
            </View>

            <View style={[styles.section, { backgroundColor: colors.card }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Progress</Text>
                <WeeklyBarChart data={weeklyData} />
            </View>

            <View style={[styles.section, { backgroundColor: colors.card }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Stats</Text>
                <View style={styles.statRow}>
                    <Text style={{ color: colors.text }}>Total Completions</Text>
                    <Text style={{ color: colors.text, fontWeight: 'bold' }}>42</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={{ color: colors.text }}>Best Streak</Text>
                    <Text style={{ color: colors.text, fontWeight: 'bold' }}>12 days</Text>
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
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
    },
    subtitle: {
        fontSize: 16,
        marginTop: 8,
    },
    section: {
        margin: 16,
        padding: 16,
        borderRadius: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
});
