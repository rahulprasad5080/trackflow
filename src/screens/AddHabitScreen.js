import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';
import { habitService } from '../database/habitService';

export default function AddHabitScreen({ navigation }) {
    const { colors } = useTheme();
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('1');
    const [unit, setUnit] = useState('times');

    const handleSave = async () => {
        if (!name) return;

        await habitService.createHabit({
            name,
            goal: parseInt(goal),
            unit,
            icon: 'star', // Default
            color: '#4F46E5', // Default
        });

        navigation.goBack();
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.form}>
                <Text style={[styles.label, { color: colors.text }]}>Habit Name</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                    placeholder="e.g. Drink Water"
                    placeholderTextColor={colors.textSecondary}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={[styles.label, { color: colors.text }]}>Daily Goal</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                    value={goal}
                    onChangeText={setGoal}
                    keyboardType="numeric"
                />

                <Text style={[styles.label, { color: colors.text }]}>Unit</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                    value={unit}
                    onChangeText={setUnit}
                    placeholder="e.g. glasses"
                    placeholderTextColor={colors.textSecondary}
                />

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.tint }]}
                    onPress={handleSave}
                >
                    <Text style={styles.buttonText}>Create Habit</Text>
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
    form: {
        marginTop: 24,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        fontSize: 16,
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
