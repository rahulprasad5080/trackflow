import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';
import { getMonthName } from '../utils/dateUtils';

export const MonthSwitcher = ({ date, onPrev, onNext }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPrev} style={styles.button}>
                <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.text, { color: colors.text }]}>{getMonthName(date)}</Text>
            <TouchableOpacity onPress={onNext} style={styles.button}>
                <Ionicons name="chevron-forward" size={24} color={colors.text} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
    },
    button: {
        padding: 8,
    },
});
