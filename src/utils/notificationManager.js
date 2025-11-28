import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const scheduleReminder = async (title, body, hour, minute, weekday = null) => {
    try {
        const trigger = weekday !== null
            ? { hour, minute, weekday, repeats: true }
            : { hour, minute, repeats: true };

        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
            },
            trigger,
        });
        return id;
    } catch (e) {
        console.error('Error scheduling notification', e);
        return null;
    }
};

export const cancelReminder = async (id) => {
    try {
        await Notifications.cancelScheduledNotificationAsync(id);
    } catch (e) {
        console.error('Error canceling notification', e);
    }
};

export const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
};
