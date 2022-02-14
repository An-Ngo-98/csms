import * as moment from 'moment';
import { DateFormat } from '../consts/date-format.const';
import { DayOfWeek } from '../enums/day-of-week.enum';

export class MomentHelper {
    public static formatDate(date: Date | moment.Moment | string | any, format: string = DateFormat.DateFormat): string {
        return moment(date).format(format);
    }

    public static parseToJsonString(date: Date | moment.Moment | string | any): string {
        return moment(date).format(DateFormat.DateFormatJson);
    }

    public static parseToMoment(date: Date | string | moment.Moment | any, format: string = ''): moment.Moment {
        if (format !== '') {
            return moment(moment(date).format(format));
        }
        return moment(date);
    }

    public static equalDate(
        date: Date | moment.Moment | string | any,
        dateCheck: Date | moment.Moment | string | any = moment()): boolean {
        return moment(date).isSame(moment(dateCheck), 'days');
    }

    public static equalGreaterDate(
        date: Date | moment.Moment | string | any,
        dateCheck: Date | moment.Moment | string | any = moment()): boolean {
        return moment(date).isSameOrAfter(moment(dateCheck), 'days');
    }

    public static equalLessDate(
        date: Date | moment.Moment | string | any,
        dateCheck: Date | moment.Moment | string | any = moment()): boolean {
        return moment(date).isSameOrBefore(moment(dateCheck), 'days');
    }

    public static lessDate(
        date: Date | moment.Moment | string | any,
        dateCheck: Date | moment.Moment | string | any = moment()): boolean {
        return moment(date).isBefore(moment(dateCheck), 'days');
    }

    public static greaterDate(
        date: Date | moment.Moment | string | any,
        dateCheck: Date | moment.Moment | string | any = moment()): boolean {
        return moment(date).isAfter(moment(dateCheck), 'days');
    }

    public static dayOfWeek(day: number): string {
        return moment().day(day).format(DateFormat.DayOfWeek);
    }

    public static currentDate(format: string = DateFormat.DateFormatJson): moment.Moment {
        return moment(moment().format(format));
    }

    public static addDay(date: moment.Moment | Date | string | any, duration: number): moment.Moment {
        return moment(date).add(duration, 'days');
    }

    public static subtractDay(date: moment.Moment | Date | string | any, duration: number): moment.Moment {
        return moment(date).subtract(duration, 'days');
    }

    public static diffTwoDays(date1: moment.Moment | Date | string | any, date2: moment.Moment | Date | string | any): number {
        return moment(date1).diff(moment(date2), 'days');
    }

    public static addMonth(date: moment.Moment | Date | string | any, duration: number): moment.Moment {
        return moment(date).add(duration, 'months');
    }

    public static addYear(date: moment.Moment | Date | string | any, duration: number): moment.Moment {
        return moment(date).add(duration, 'years');
    }

    public static startDateOfYear(date: Date | moment.Moment | string | any = moment()): moment.Moment {
        return moment(date).startOf('year');
    }

    public static endDateOfYear(date: Date | moment.Moment | string | any = moment()): moment.Moment {
        return moment(date).endOf('year');
    }

    public static equalYear(
        date: Date | moment.Moment | string | any,
        dateCheck: Date | moment.Moment | string | any = moment()): boolean {
        return moment(date).isSame(moment(dateCheck), 'years');
    }

    public static equalGreaterYear(
        date: Date | moment.Moment | string | any,
        dateCheck: Date | moment.Moment | string | any = moment()): boolean {
        return moment(date).isSameOrAfter(moment(dateCheck), 'years');
    }

    public static equalLessYear(
        date: Date | moment.Moment | string | any,
        dateCheck: Date | moment.Moment | string | any = moment()): boolean {
        return moment(date).isSameOrBefore(moment(dateCheck), 'years');
    }

    public static lessYear(
        date: Date | moment.Moment | string | any,
        dateCheck: Date | moment.Moment | string | any = moment()): boolean {
        return moment(date).isBefore(moment(dateCheck), 'years');
    }

    public static greaterYear(
        date: Date | moment.Moment | string | any,
        dateCheck: Date | moment.Moment | string | any = moment()): boolean {
        return moment(date).isAfter(moment(dateCheck), 'years');
    }

    public static durationDay(
        date: Date | moment.Moment | string | any,
        dateCheck: Date | moment.Moment | string | any = moment()): number {
        return moment(date).diff(moment(dateCheck), 'days');
    }

    public static isSunday(date: Date | moment.Moment | string | any): boolean {
        return moment(date).day() === DayOfWeek.Sun;
    }

    public static isMonday(date: Date | moment.Moment | string | any): boolean {
        return moment(date).day() === DayOfWeek.Mon;
    }

    public static isTueday(date: Date | moment.Moment | string | any): boolean {
        return moment(date).day() === DayOfWeek.Tue;
    }

    public static isWednerday(date: Date | moment.Moment | string | any): boolean {
        return moment(date).day() === DayOfWeek.Wed;
    }

    public static isThurday(date: Date | moment.Moment | string | any): boolean {
        return moment(date).day() === DayOfWeek.Thu;
    }

    public static isFriday(date: Date | moment.Moment | string | any): boolean {
        return moment(date).day() === DayOfWeek.Fri;
    }

    public static isSaterday(date: Date | moment.Moment | string | any): boolean {
        return moment(date).day() === DayOfWeek.Sat;
    }

    public static startDateOfMonth(date: Date | moment.Moment | string | any = moment()): moment.Moment {
        return moment(date).startOf('month');
    }

    public static startOfMonth(month: number, year: number): moment.Moment {
        return moment().month(month).year(year).startOf('month');
    }

    public static endDateOfMonth(date: Date | moment.Moment | string | any = moment()): moment.Moment {
        return moment(date).endOf('month');
    }

    public static getDay(date: Date | moment.Moment | string | any = moment()): number {
        return moment(date).date();
    }

    public static getMonth(date: Date | moment.Moment | string | any = moment()): number {
        return moment(date).month();
    }

    public static getYear(date: Date | moment.Moment | string | any = moment()): number {
        return moment(date).year();
    }

    public static getDayOfWeekShort(date: Date | moment.Moment | string | any = moment()): string {
        return moment(date).format('ddd');
    }

    public static getDayOfWeekFull(date: Date | moment.Moment | string | any = moment()): string {
        return moment(date).format('dddd');
    }

    public static setDate(date: number, month: number, year: number): moment.Moment {
        return moment(moment().date(date).month(month).year(year).format(DateFormat.DateFormatJson));
    }

    public static parseDateToString(
        date: Date | moment.Moment | string | any = moment(),
        outputWhenInvalid: string = '-',
        format: string = DateFormat.DateFormat): string {
        if (moment(date).isValid() && date !== DateFormat.MinDateJson) {
            return moment(date).format(format);
        }
        return outputWhenInvalid;
    }
}
