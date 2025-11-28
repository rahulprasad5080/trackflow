import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface HeatSquareProps {
    color: string;
    size?: number;
}

export const HeatSquare = ({ color, size = 16 }: HeatSquareProps) => {
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 500 });
    }, [color]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        backgroundColor: color,
    }));

    return (
        <Animated.View
            style={[
                styles.square,
                { width: size, height: size, borderRadius: size / 4 },
                animatedStyle
            ]}
        />
    );
};

const styles = StyleSheet.create({
    square: {
        margin: 2,
    },
});
