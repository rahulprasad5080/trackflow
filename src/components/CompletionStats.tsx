import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../constants/theme';

interface CompletionStatsProps {
    currentStreak: number;
    bestStreak: number;
    weeklyCompletions: number;
    weeklyTotal: number;
    successRate: number;
}

export function CompletionStats({
    currentStreak,
    bestStreak,
    weeklyCompletions,
    weeklyTotal,
    successRate,
}: CompletionStatsProps) {
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';

    const streakGradient = isDark
        ? ['#f59e0b', '#f97316', '#ea580c'] as const
        : ['#fbbf24', '#f59e0b', '#f97316'] as const;

    const completionGradient = isDark
        ? ['#8b5cf6', '#7c3aed', '#6d28d9'] as const
        : ['#a78bfa', '#8b5cf6', '#7c3aed'] as const;

    const successGradient = isDark
        ? ['#10b981', '#059669', '#047857'] as const
        : ['#34d399', '#10b981', '#059669'] as const;

    return (
        <View style={styles.container}>
            {/* Current Streak */}
            <LinearGradient
                colors={streakGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
            >
                <Text style={styles.emoji}>🔥</Text>
                <Text style={styles.statValue}>{currentStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
                <Text style={styles.statSubtext}>Best: {bestStreak}</Text>
            </LinearGradient>

            {/* Weekly Completions */}
            <LinearGradient
                colors={completionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
            >
                <Text style={styles.emoji}>✅</Text>
                <Text style={styles.statValue}>{weeklyCompletions}/{weeklyTotal}</Text>
                <Text style={styles.statLabel}>This Week</Text>
                <Text style={styles.statSubtext}>Completed</Text>
            </LinearGradient>

            {/* Success Rate */}
            <LinearGradient
                colors={successGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
            >
                <Text style={styles.emoji}>📊</Text>
                <Text style={styles.statValue}>{successRate}%</Text>
                <Text style={styles.statLabel}>Success Rate</Text>
                <Text style={styles.statSubtext}>7 Days</Text>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    emoji: {
        fontSize: 28,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFF',
        opacity: 0.9,
        marginBottom: 2,
    },
    statSubtext: {
        fontSize: 10,
        color: '#FFF',
        opacity: 0.7,
    },
});
