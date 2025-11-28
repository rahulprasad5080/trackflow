import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/theme';

export const HabitFilterChips = ({ habits, selectedId, onSelect }) => {
    const { colors } = useTheme();

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.chip,
                    {
                        backgroundColor: selectedId === null ? colors.tint : colors.surface,
                        borderColor: colors.border
                    }
                ]}
                onPress={() => onSelect(null)}
            >
                <Text style={{ color: selectedId === null ? '#FFF' : colors.text }}>All</Text>
            </TouchableOpacity>

            {habits.map(habit => (
                <TouchableOpacity
                    key={habit.id}
                    style={[
                        styles.chip,
                        {
                            backgroundColor: selectedId === habit.id ? habit.color : colors.surface,
                            borderColor: colors.border
                        }
                    ]}
                    onPress={() => onSelect(habit.id)}
                >
                    <Text style={{ color: selectedId === habit.id ? '#FFF' : colors.text }}>
                        {habit.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
});
