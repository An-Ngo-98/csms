import moment from 'moment';
import { DateFormat } from '../../commons/constants';


export const formatDate = (date, format = DateFormat.DateFormat) => {
    return moment(date).format(format);
}

export const parseToDate = (date) => {
    return new Date(date);
}