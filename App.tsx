import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/constants/theme'; // We'll create this context
import { initDB } from './src/database/db';
import AppNavigator from './src/navigation/AppNavigator';

// Initialize database
initDB().catch(err => console.error('DB Init Failed:', err));

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AppNavigator />
                <StatusBar style="auto" />
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
