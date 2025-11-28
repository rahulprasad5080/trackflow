import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export const BottomSheet = ({ visible, onClose, children, title }: BottomSheetProps) => {
    const { colors } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <View style={[styles.sheet, { backgroundColor: colors.card }]}>
                    <View style={styles.header}>
                        <View style={[styles.handle, { backgroundColor: colors.border }]} />
                        {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
                    </View>
                    <View style={styles.content}>
                        {children}
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
        minHeight: 300,
    },
    header: {
        alignItems: 'center',
        padding: 16,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
    },
});
