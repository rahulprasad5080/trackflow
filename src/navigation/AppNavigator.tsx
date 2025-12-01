import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTheme } from '../constants/theme';
import { Habit } from '../types';

// Screens
import AddHabitScreen from '../screens/AddHabitScreen';

import AnalyticsScreen from '../screens/AnalyticsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TaskScreen from '../screens/TaskScreen';

export type RootStackParamList = {
    Main: undefined;
    HabitDetail: { habit: Habit };
    AddHabit: undefined;

};

export type TabParamList = {
    Dashboard: undefined;
    Analytics: undefined;
    Tasks: undefined;
    Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator() {
    const { colors, theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'help';

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Analytics') {
                        iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    } else if (route.name === 'Tasks') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.tint,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                },
                headerStyle: {
                    backgroundColor: colors.card,
                },
                headerTintColor: colors.text,
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Analytics" component={AnalyticsScreen} />
            <Tab.Screen name="Tasks" component={TaskScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { theme } = useTheme();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Main"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="HabitDetail"
                    component={HabitDetailScreen}
                    options={{
                        title: 'Habit Details',
                        headerStyle: { backgroundColor: theme === 'dark' ? '#1F2937' : '#FFF' },
                        headerTintColor: theme === 'dark' ? '#FFF' : '#000',
                    }}
                />
                <Stack.Screen
                    name="AddHabit"
                    component={AddHabitScreen}
                    options={{
                        presentation: 'modal',
                        title: 'New Habit',
                        headerStyle: { backgroundColor: theme === 'dark' ? '#1F2937' : '#FFF' },
                        headerTintColor: theme === 'dark' ? '#FFF' : '#000',
                    }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
