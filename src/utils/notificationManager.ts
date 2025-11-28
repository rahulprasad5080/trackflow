import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const scheduleNotification = async (title: string, body: string, hour: number, minute: number) => {
    const trigger: Notifications.DailyTriggerInput = {
        hour,
        minute,
    };

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: true,
        },
        trigger,
    });
    return id;
};

export const cancelNotification = async (id: string) => {
    await Notifications.cancelScheduledNotificationAsync(id);
};

export const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
};
