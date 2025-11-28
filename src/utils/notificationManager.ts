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

// Schedule a daily recurring notification at a specific time
export const scheduleNotification = async (title: string, body: string, hour: number, minute: number) => {
    const trigger: Notifications.DailyTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
    };

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: true,
        },
        trigger: trigger,
    });
    return id;
};

// Schedule a notification after a specific number of seconds (for testing)
export const scheduleNotificationInSeconds = async (title: string, body: string, seconds: number) => {
    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: seconds,
        },
    });
    return id;
};

// Schedule a notification at a specific date/time (one-time)
export const scheduleNotificationAtTime = async (title: string, body: string, date: Date) => {
    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: date,
        },
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
