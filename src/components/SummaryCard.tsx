import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../constants/theme';

interface SummaryCardProps {
    title: string;
    value: string;
    subtitle?: string;
}

export const SummaryCard = ({ title, value, subtitle }: SummaryCardProps) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
            <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
            {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        flex: 1,
        marginHorizontal: 6,
    },
    title: {
        fontSize: 14,
        marginBottom: 8,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
        marginTop: 4,
    },
});
