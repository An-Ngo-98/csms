export class JsHelper {

    public static getRandomInt(min: number = 0, max: number): number {
        const minNum: number = Math.ceil(min);
        const maxNum: number = Math.floor(max);
        return Math.floor((Math.random() * (max - min)) + min);
    }

    public static executeImmediately(callback: () => void, timeout: number = 0): void {
        setTimeout(() => {
            callback();
        }, timeout);
    }

    public static executeWithInterval(callback: () => void, interval: number): void {
        setInterval(() => {
            callback();
        }, interval);
    }

    public static normalizeTextInput(input: string): string {
        let val: string = input.trim().toLocaleLowerCase();
        val = val.split(' ').join('');
        return val;
    }

    public static isNumber(value: any): boolean {
        const x = +value;
        return x.toString() === value && x !== NaN;
    }
}
