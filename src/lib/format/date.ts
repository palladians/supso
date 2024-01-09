import { format } from 'date-fns';

export const formatDate = (date: string) => {
	return format(new Date(parseInt(date)), 'PPp');
};

export const formatDateShort = (date: string) => {
	return format(new Date(parseInt(date)), 'P');
};
