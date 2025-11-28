import { COLORS } from '../constants/colors';

export const getHeatmapColor = (count: number, theme: 'light' | 'dark' = 'light'): string => {
    const palette = COLORS.heatmap;
    const isDark = theme === 'dark';

    if (count === 0) return isDark ? palette.dark0 : palette[0];
    if (count <= 1) return isDark ? palette.dark1 : palette[1];
    if (count <= 3) return isDark ? palette.dark2 : palette[2];
    if (count <= 5) return isDark ? palette.dark3 : palette[3];
    return isDark ? palette.dark4 : palette[4];
};
