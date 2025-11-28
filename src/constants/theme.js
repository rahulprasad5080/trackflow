import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS } from './colors';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    const [theme, setTheme] = useState(systemScheme || 'light');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme) {
                setTheme(savedTheme);
            }
        } catch (e) {
            console.log('Failed to load theme', e);
        }
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem('theme', newTheme);
        } catch (e) {
            console.log('Failed to save theme', e);
        }
    };

    const themeColors = theme === 'light' ? COLORS.light : COLORS.dark;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors: themeColors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
