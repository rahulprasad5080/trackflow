import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { getChartTheme } from '../constants/chartTheme';
import { useTheme } from '../constants/theme';

interface AnalyticsChartProps {
    data: { value: number; label: string; date: string }[];
    title: string;
    type?: 'line' | 'bar';
    color?: string;
}

const screenWidth = Dimensions.get('window').width;

export function AnalyticsChart({ data, title, type = 'line', color }: AnalyticsChartProps) {
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const chartTheme = getChartTheme(colors, isDark);

    const chartColor = color || chartTheme.primaryColor;

    // Transform data for the chart
    const chartData = data.map((item, index) => ({
        value: item.value,
        label: item.label,
        dataPointText: item.value.toString(),
        frontColor: chartColor,
        gradientColor: chartColor,
        spacing: index === 0 ? 0 : chartTheme.chart.spacing,
    }));

    const maxValue = Math.max(...data.map(d => d.value), 5);

    const commonProps = {
        data: chartData,
        width: screenWidth - 80,
        height: 180,
        maxValue: maxValue,
        noOfSections: 4,
        yAxisColor: chartTheme.gridColor,
        xAxisColor: chartTheme.gridColor,
        yAxisTextStyle: { color: colors.textSecondary, fontSize: 10 },
        xAxisLabelTextStyle: { color: colors.textSecondary, fontSize: 10 },
        backgroundColor: 'transparent',
        hideRules: false,
        rulesColor: chartTheme.gridColor,
        rulesType: 'dashed' as const,
        dashWidth: 4,
        dashGap: 4,
        animationDuration: chartTheme.animation.duration,
        isAnimated: true,
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <View style={styles.chartContainer}>
                {type === 'line' ? (
                    <LineChart
                        {...commonProps}
                        color={chartColor}
                        thickness={chartTheme.chart.strokeWidth}
                        startFillColor={chartColor}
                        endFillColor={chartColor}
                        startOpacity={0.3}
                        endOpacity={0.05}
                        areaChart
                        curved
                        dataPointsColor={chartColor}
                        dataPointsRadius={chartTheme.chart.dotSize / 2}
                        textColor={colors.text}
                        textFontSize={chartTheme.chart.fontSize}
                        hideDataPoints={false}
                    />
                ) : (
                    <BarChart
                        {...commonProps}
                        barWidth={chartTheme.chart.barWidth}
                        barBorderRadius={chartTheme.chart.borderRadius}
                        frontColor={chartColor}
                        gradientColor={chartColor}
                        showGradient
                        cappedBars
                        capColor={chartColor}
                        capThickness={4}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    chartContainer: {
        alignItems: 'center',
        paddingVertical: 8,
    },
});
