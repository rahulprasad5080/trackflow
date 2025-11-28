import { Ionicons } from '@expo/vector-icons';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';

export default function SettingsScreen() {
    const { colors, toggleTheme, theme } = useTheme();

    const handleReset = () => {
        Alert.alert(
            "Reset Data",
            "Are you sure you want to delete all data? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => console.log("Resetting...") }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
                <TouchableOpacity style={[styles.row, { backgroundColor: colors.card }]} onPress={toggleTheme}>
                    <Text style={[styles.rowText, { color: colors.text }]}>Dark Mode</Text>
                    <Ionicons
                        name={theme === 'dark' ? "moon" : "sunny"}
                        size={24}
                        color={colors.text}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Data</Text>
                <TouchableOpacity style={[styles.row, { backgroundColor: colors.card }]} onPress={handleReset}>
                    <Text style={[styles.rowText, { color: colors.danger }]}>Reset All Data</Text>
                    <Ionicons name="trash-outline" size={24} color={colors.danger} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        textTransform: 'uppercase',
        marginBottom: 8,
        marginLeft: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
    },
    rowText: {
        fontSize: 16,
    },
});
