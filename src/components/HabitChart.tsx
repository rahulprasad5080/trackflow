import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from '../constants/theme';

interface HabitChartProps {
    data: { value: number; label: string; date: string }[];
}

export const HabitChart = ({ data }: HabitChartProps) => {
    const { colors } = useTheme();
    const screenWidth = Dimensions.get('window').width;

    if (!data || data.length === 0) return null;

    const spacing = (screenWidth - 60) / data.length;

    const chartData = data.map(item => ({
        value: item.value,
        label: item.label,
        dataPointText: item.value > 0 ? item.value.toString() : '',
        textColor: colors.text,
        textShiftY: -10,
        textFontSize: 10,
    }));

    return (
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Weekly Progress</Text>

            <LineChart
                data={chartData}
                curved
                areaChart
                isAnimated
                color={colors.tint}
                startFillColor={colors.tint}
                endFillColor={colors.tint}
                startOpacity={0.7}
                endOpacity={0.2}
                thickness={3}
                dataPointsColor={colors.tint}
                dataPointsRadius={4}

                // ⭐ SHOW X & Y AXIS BORDER ⭐
                xAxisThickness={1}
                yAxisThickness={1}
                xAxisColor={colors.border}
                yAxisColor={colors.border}

                // Show horizontal grid lines if needed
                hideRules={true}
                rulesColor={colors.border}

                // Fix cutoff issue
                width={screenWidth - 32}
                initialSpacing={10}
                endSpacing={10}
                spacing={spacing}

                xAxisLabelTextStyle={{ color: colors.text, fontSize: 10 }}
                yAxisTextStyle={{ color: colors.text, fontSize: 10 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});
