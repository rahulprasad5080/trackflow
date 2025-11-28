import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../constants/theme';
import { getHeatmapColor } from '../utils/colorUtils';

export const HeatSquare = ({ value, size = 20 }) => {
    const { theme } = useTheme();
    const color = getHeatmapColor(value, theme);
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 500 });
    }, []);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
        backgroundColor: color,
    }));

    return (
        <Animated.View style={[styles.square, { width: size, height: size }, style]} />
    );
};

const styles = StyleSheet.create({
    square: {
        borderRadius: 4,
        margin: 2,
    },
});
