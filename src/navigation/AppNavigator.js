import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../constants/theme';

// Screens
import AddHabitScreen from '../screens/AddHabitScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import RemindersScreen from '../screens/RemindersScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
    const { colors, theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Analytics') {
                        iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    } else if (route.name === 'Reminders') {
                        iconName = focused ? 'alarm' : 'alarm-outline';
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
            <Tab.Screen name="Reminders" component={RemindersScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { colors, theme } = useTheme();

    return (
        <NavigationContainer theme={{
            dark: theme === 'dark',
            colors: {
                primary: colors.tint,
                background: colors.background,
                card: colors.card,
                text: colors.text,
                border: colors.border,
                notification: colors.danger,
            }
        }}>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: colors.card },
                    headerTintColor: colors.text,
                }}
            >
                <Stack.Screen
                    name="Main"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="HabitDetail"
                    component={HabitDetailScreen}
                    options={{ title: 'Habit Details' }}
                />
                <Stack.Screen
                    name="AddHabit"
                    component={AddHabitScreen}
                    options={{ title: 'New Habit', presentation: 'modal' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
