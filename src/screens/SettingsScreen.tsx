import React from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';

export default function SettingsScreen() {
    const { theme, toggleTheme, colors } = useTheme();

    const handleReset = () => {
        Alert.alert(
            "Reset Data",
            "Are you sure you want to delete all data? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        // Logic to clear DB
                        console.log("Data cleared");
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.section, { backgroundColor: colors.card }]}>
                <View style={styles.row}>
                    <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
                    <Switch
                        value={theme === 'dark'}
                        onValueChange={toggleTheme}
                        trackColor={{ false: colors.border, true: colors.tint }}
                    />
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: colors.card }]}>
                <TouchableOpacity style={styles.row} onPress={handleReset}>
                    <Text style={[styles.label, { color: colors.danger }]}>Reset All Data</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.0.0</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    label: {
        fontSize: 16,
    },
    version: {
        textAlign: 'center',
        marginTop: 20,
    },
});
