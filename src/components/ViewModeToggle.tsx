import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';

interface ViewModeToggleProps {
    mode: 'grid' | 'list';
    onToggle: (mode: 'grid' | 'list') => void;
}

export function ViewModeToggle({ mode, onToggle }: ViewModeToggleProps) {
    const { colors } = useTheme();

    const handleToggle = (newMode: 'grid' | 'list') => {
        if (newMode !== mode) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onToggle(newMode);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity
                style={[
                    styles.button,
                    mode === 'grid' && { backgroundColor: colors.tint },
                ]}
                onPress={() => handleToggle('grid')}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="grid"
                    size={18}
                    color={mode === 'grid' ? '#FFF' : colors.textSecondary}
                />
                <Text
                    style={[
                        styles.buttonText,
                        { color: mode === 'grid' ? '#FFF' : colors.textSecondary },
                    ]}
                >
                    Grid
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.button,
                    mode === 'list' && { backgroundColor: colors.tint },
                ]}
                onPress={() => handleToggle('list')}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="list"
                    size={18}
                    color={mode === 'list' ? '#FFF' : colors.textSecondary}
                />
                <Text
                    style={[
                        styles.buttonText,
                        { color: mode === 'list' ? '#FFF' : colors.textSecondary },
                    ]}
                >
                    List
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
