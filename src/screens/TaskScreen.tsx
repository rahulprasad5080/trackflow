import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { useTheme } from '../constants/theme';
import { addTask, deleteTask, getTasks, toggleTaskCompletion } from '../database/taskService';
import { Task } from '../types';

export default function TaskScreen() {
    const { colors, theme } = useTheme();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskText, setNewTaskText] = useState('');

    const loadTasks = async () => {
        try {
            const loadedTasks = await getTasks();
            setTasks(loadedTasks);
        } catch (error) {
            console.error('Failed to load tasks:', error);
            Alert.alert('Error', 'Failed to load tasks. Please reload the app.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTasks();
        }, [])
    );

    const handleAddTask = async () => {
        if (!newTaskText.trim()) return;

        try {
            const newTask = await addTask(newTaskText.trim());
            setTasks(prev => [newTask, ...prev].sort((a, b) => a.completed - b.completed));
            setNewTaskText('');
        } catch (error) {
            console.error('Failed to add task:', error);
            Alert.alert('Error', 'Failed to add task. Please try reloading the app.');
        }
    };

    const handleToggleTask = async (task: Task) => {
        try {
            const newCompletedState = !task.completed;
            await toggleTaskCompletion(task.id, newCompletedState);

            setTasks(prev =>
                prev.map(t =>
                    t.id === task.id ? { ...t, completed: newCompletedState ? 1 : 0 } : t
                ).sort((a, b) => {
                    // Sort by completed status (0 first, then 1)
                    if (a.completed !== b.completed) return a.completed - b.completed;
                    // Then by id (descending) to keep newest first
                    return b.id - a.id;
                })
            );
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    const handleDeleteTask = async (id: number) => {
        try {
            await deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete task:', error);
            Alert.alert('Error', 'Failed to delete task');
        }
    };

    const renderItem = ({ item }: { item: Task }) => (
        <Animated.View
            layout={Layout.springify()}
            entering={FadeIn}
            exiting={FadeOut}
            style={[styles.taskItem, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleToggleTask(item)}
            >
                <View style={[
                    styles.checkbox,
                    { borderColor: item.completed ? colors.primary : colors.textSecondary },
                    item.completed ? { backgroundColor: colors.primary } : undefined
                ]}>
                    {item.completed ? <Ionicons name="checkmark" size={16} color="#FFF" /> : null}
                </View>
            </TouchableOpacity>

            <View style={styles.textContainer}>
                <Text style={[
                    styles.taskText,
                    { color: item.completed ? colors.textSecondary : colors.text },
                    item.completed ? styles.completedText : undefined
                ]}>
                    {item.text}
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => handleDeleteTask(item.id)}
                style={styles.deleteButton}
            >
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={tasks}
                style={{ flex: 1 }}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="list-outline" size={64} color={colors.textSecondary} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            No tasks yet. Add one below!
                        </Text>
                    </View>
                }
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}
            >
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme === 'dark' ? '#374151' : '#F3F4F6',
                        color: colors.text,
                        borderColor: colors.border
                    }]}
                    placeholder="Add a new task..."
                    placeholderTextColor={colors.textSecondary}
                    value={newTaskText}
                    onChangeText={setNewTaskText}
                    onSubmitEditing={handleAddTask}
                />
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                    onPress={handleAddTask}
                >
                    <Ionicons name="add" size={24} color="#FFF" />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 8,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    checkboxContainer: {
        padding: 4,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
    },
    taskText: {
        fontSize: 16,
        fontWeight: '500',
    },
    completedText: {
        textDecorationLine: 'line-through',
    },
    deleteButton: {
        padding: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        paddingHorizontal: 16,
        marginRight: 12,
        borderWidth: 1,
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
    },
});
