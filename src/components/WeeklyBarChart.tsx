import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../constants/theme';

interface WeeklyBarChartProps {
    data: { value: number }[];
}

export const WeeklyBarChart = ({ data }: WeeklyBarChartProps) => {
    const { colors } = useTheme();
    const max = Math.max(...data.map(d => d.value), 1);

    return (
        <View style={styles.container}>
            {data.map((d, i) => (
                <View key={i} style={styles.barContainer}>
                    <View
                        style={[
                            styles.bar,
                            {
                                height: `${(d.value / max) * 100}%`,
                                backgroundColor: d.value > 0 ? colors.tint : colors.border
                            }
                        ]}
                    />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 150,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: 16,
    },
    barContainer: {
        width: 20,
        height: '100%',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        borderRadius: 4,
    },
});
