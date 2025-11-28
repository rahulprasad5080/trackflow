import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, startOfMonth, startOfWeek, subMonths } from 'date-fns';

export const formatDate = (date: Date | number | string, formatStr: string = 'yyyy-MM-dd'): string => {
    return format(new Date(date), formatStr);
};

export const getToday = (): string => {
    return format(new Date(), 'yyyy-MM-dd');
};

export const getWeekDays = (date: Date = new Date()): Date[] => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
};

export const getMonthDays = (date: Date = new Date()): Date[] => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
};

export const isSameDate = (date1: Date | string | number, date2: Date | string | number): boolean => {
    return isSameDay(new Date(date1), new Date(date2));
};

export const getPreviousMonth = (date: Date): Date => subMonths(date, 1);
export const getNextMonth = (date: Date): Date => addMonths(date, 1);

export const getMonthName = (date: Date): string => format(date, 'MMMM yyyy');
