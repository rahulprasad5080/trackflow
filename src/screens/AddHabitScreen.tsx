import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';
import { habitService } from '../database/habitService';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AddHabit'>;

export default function AddHabitScreen({ navigation }: Props) {
    const { colors } = useTheme();
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('1');
    const [unit, setUnit] = useState('times');

    const handleSave = async () => {
        if (!name) return;

        await habitService.createHabit({
            name,
            goal: parseInt(goal) || 1,
            unit,
            icon: 'star', // Default icon
            color: colors.tint, // Default color
        });

        navigation.goBack();
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
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
                />

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.tint }]}
                    onPress={handleSave}
                >
                    <Text style={styles.buttonText}>Create Habit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    button: {
        marginTop: 32,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
