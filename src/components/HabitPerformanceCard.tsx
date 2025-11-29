import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../constants/theme';

interface HabitPerformanceCardProps {
    name: string;
    icon: string;
    color: string;
    completionRate: number;
    completedDays: number;
    totalDays: number;
    variant?: 'best' | 'worst';
}

export const HabitPerformanceCard = ({
    name,
    icon,
    color,
    completionRate,
    completedDays,
    totalDays,
    variant = 'best'
}: HabitPerformanceCardProps) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <Text style={styles.icon}>{icon}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                        {name}
                    </Text>
                    <Text style={[styles.stats, { color: colors.textSecondary }]}>
                        {completedDays}/{totalDays} days
                    </Text>
                </View>
                <Text style={[styles.percentage, { color: variant === 'best' ? '#4CAF50' : '#FF9800' }]}>
                    {completionRate.toFixed(0)}%
                </Text>
            </View>

            {/* Progress Bar */}
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${completionRate}%`,
                            backgroundColor: variant === 'best' ? '#4CAF50' : '#FF9800'
                        }
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 20,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    stats: {
        fontSize: 12,
    },
    percentage: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
});
