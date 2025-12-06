import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTheme } from '../constants/theme';

interface HabitChartProps {
    data: { value: number; label: string; date: string }[];
}

export const HabitChart = ({ data }: HabitChartProps) => {
    const { colors } = useTheme();

    if (!data || data.length === 0) {
        return null;
    }

    // Transform data for the chart library if needed, but currently it matches closely.
    // We want to style the bars.
    const chartData = data.map(item => ({
        value: item.value,
        label: item.label,
        frontColor: colors.tint,
        topLabelComponent: () => (
            <Text style={{ color: colors.text, fontSize: 10, marginBottom: 2 }}>
                {item.value > 0 ? item.value : ''}
            </Text>
        ),
    }));

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text }]}>Weekly Progress</Text>
            <View style={styles.chartContainer}>
                <BarChart
                    data={chartData}
                    barWidth={30}
                    noOfSections={4}
                    barBorderRadius={4}
                    frontColor={colors.tint}
                    yAxisThickness={0}
                    xAxisThickness={0}
                    xAxisLabelTextStyle={{ color: colors.text, fontSize: 10 }}
                    yAxisTextStyle={{ color: colors.text, fontSize: 10 }}
                    initialSpacing={10}
                    spacing={20}
                    hideRules
                    showYAxisIndices={false}
                    isAnimated
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
