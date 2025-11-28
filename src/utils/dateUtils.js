import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, startOfMonth, startOfWeek, subMonths } from 'date-fns';

export const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
    return format(new Date(date), formatStr);
};

export const getToday = () => {
    return format(new Date(), 'yyyy-MM-dd');
};

export const getWeekDays = (date = new Date()) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
};

export const getMonthDays = (date = new Date()) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
};

export const isSameDate = (date1, date2) => {
    return isSameDay(new Date(date1), new Date(date2));
};

export const getPreviousMonth = (date) => subMonths(date, 1);
export const getNextMonth = (date) => addMonths(date, 1);

export const getMonthName = (date) => format(date, 'MMMM yyyy');
