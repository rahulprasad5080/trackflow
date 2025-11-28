import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HeatSquare } from '../components/HeatSquare';
import { MonthSwitcher } from '../components/MonthSwitcher';
import { useTheme } from '../constants/theme';
import { getMonthDays, getNextMonth, getPreviousMonth } from '../utils/dateUtils';

export default function AnalyticsScreen() {
    const { colors } = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date());

    const days = getMonthDays(currentDate);

    const handlePrev = () => setCurrentDate(getPreviousMonth(currentDate));
    const handleNext = () => setCurrentDate(getNextMonth(currentDate));

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <MonthSwitcher date={currentDate} onPrev={handlePrev} onNext={handleNext} />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Activity Heatmap</Text>
                    <View style={styles.heatmap}>
                        {days.map((day, i) => (
                            <HeatSquare key={i} value={Math.floor(Math.random() * 5)} size={24} />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    card: {
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    heatmap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 4,
    },
});
