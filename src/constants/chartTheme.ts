import { ThemeColors } from '../types';

export const getChartTheme = (colors: ThemeColors, isDark: boolean) => ({
    // Chart colors
    primaryColor: colors.tint,
    secondaryColor: colors.accent,
    backgroundColor: colors.surface,
    textColor: colors.text,
    gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',

    // Gradients for charts
    gradients: {
        primary: isDark
            ? ['#6366f1', '#8b5cf6', '#d946ef']
            : ['#818cf8', '#a78bfa', '#e879f9'],
        success: isDark
            ? ['#10b981', '#34d399', '#6ee7b7']
            : ['#34d399', '#6ee7b7', '#a7f3d0'],
        warning: isDark
            ? ['#f59e0b', '#fbbf24', '#fcd34d']
            : ['#fbbf24', '#fcd34d', '#fde68a'],
    },

    // Chart styling
    chart: {
        barWidth: 24,
        spacing: 20,
        borderRadius: 8,
        strokeWidth: 3,
        dotSize: 8,
        fontSize: 12,
        labelFontSize: 10,
    },

    // Animation settings
    animation: {
        duration: 800,
        easing: 'ease-in-out',
    },
});

export const chartColors = [
    '#6366f1', // Indigo
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#14b8a6', // Teal
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
];
