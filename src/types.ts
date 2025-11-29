export interface Habit {
    id: number;
    name: string;
    icon: string;
    color: string;
    goal: number;
    unit: string;
    created_at?: string;
    archived?: number;
    // Merged properties
    value?: number;
    completed?: number;
}

export interface Log {
    id: number;
    habit_id: number;
    date: string;
    value: number;
    completed: number;
}

export interface Reminder {
    id: number;
    habit_id: number;
    time: string;
    days: number[]; // [1, 2, 3] for Mon, Tue, Wed
    notification_id: string;
    enabled?: boolean; // UI state
    habitName?: string; // UI state
}

export interface ThemeColors {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    card: string;
    tint: string;
    // Shared colors
    primary: string;
    secondary: string;
    accent: string;
    danger: string;
}

export interface HabitPerformance {
    id: number;
    name: string;
    icon: string;
    color: string;
    completionRate: number;
    completedDays: number;
    totalDays: number;
}

export interface ThemePalette {
    primary: string;
    secondary: string;
    accent: string;
    danger: string;
    light: ThemeColors;
    dark: ThemeColors;
    heatmap: {
        [key: number]: string;
        dark0: string;
        dark1: string;
        dark2: string;
        dark3: string;
        dark4: string;
    };
}
