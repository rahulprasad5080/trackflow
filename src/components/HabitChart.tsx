import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from '../constants/theme';

interface HabitChartProps {
    data: { value: number; label: string; date: string }[];
}

export const HabitChart = ({ data }: HabitChartProps) => {
    const { colors } = useTheme();

    if (!data || data.length === 0) {
        return null;
    }

    const chartData = data.map(item => ({
        value: item.value,
        label: item.label,
        dataPointText: item.value > 0 ? item.value.toString() : '',
        textColor: colors.text,
        textShiftY: -10,
        textFontSize: 10,
    }));

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text }]}>Weekly Progress</Text>
            <View style={styles.chartContainer}>
                <LineChart
                    data={chartData}
                    areaChart
                    curved
                    isAnimated
                    color={colors.tint}
                    startFillColor={colors.tint}
                    startOpacity={0.8}
                    endFillColor={colors.tint}
                    endOpacity={0.3}
                    thickness={3}
                    dataPointsColor={colors.tint}
                    dataPointsRadius={4}
                    hideRules
                    hideYAxisText
                    xAxisColor={colors.border}
                    yAxisColor={colors.border}
                    xAxisThickness={1}
                    yAxisThickness={0}
                    xAxisLabelTextStyle={{ color: colors.text, fontSize: 10 }}
                    initialSpacing={20}
                    spacing={40}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        // Overflow hidden might cut off labels, so be careful
        overflow: 'visible',
    },
});
