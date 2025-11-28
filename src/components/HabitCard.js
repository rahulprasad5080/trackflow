import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';

export const HabitCard = ({ habit, onLog, onDetail }) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={onDetail}
        >
            <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
                <Ionicons name={habit.icon || 'star'} size={24} color={habit.color} />
            </View>
            <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]}>{habit.name}</Text>
                <Text style={[styles.goal, { color: colors.textSecondary }]}>
                    {habit.value || 0} / {habit.goal} {habit.unit}
                </Text>
            </View>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: habit.completed ? colors.tint : colors.surface }]}
                onPress={() => onLog(habit)}
            >
                <Ionicons
                    name={habit.completed ? "checkmark" : "add"}
                    size={24}
                    color={habit.completed ? '#FFF' : colors.text}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    goal: {
        fontSize: 14,
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
