import * as CryptoJs from 'crypto-js';
import { JsHelper } from './js.helper';
import { UserPermission, UserRole } from 'app/models/permission';

export class LsHelper {
    public static readonly HrmData: string = 'csms_data';
    public static readonly HrmStoragePassport: string = 'HrmStoragePassport';
    public static readonly UserPermissionStorage: string = 'csms_user_permission';
    public static readonly UserRoleStorage: string = 'csms_user_role';
    public static readonly UserStorage: string = 'csms_user';

    public static readonly PAGE_SIZE: string = 'PAGE_SIZE';
    public static readonly PAGE_SIZE_DEFAULT = 10;

    private static etStorage: Storage = localStorage;

    public static save(key: string, data: any): boolean {
        try {
            const cipherData: CryptoJs.WordArray =
                CryptoJs.AES.encrypt(JSON.stringify(data), LsHelper.HrmStoragePassport);
            this.etStorage.setItem(key, cipherData.toString());
            return true;
        } catch (err) {
            console.log('Error when serializing data ', err);
            return false;
        }
    }

    public static getItem(key: string): any {
        const cipherText: string = LsHelper.etStorage.getItem(key);
        if (!cipherText) { return undefined; }
        try {
            const bytes: CryptoJs.DecryptedMessage =
                CryptoJs.AES.decrypt(cipherText, LsHelper.HrmStoragePassport);
            return JSON.parse(bytes.toString(CryptoJs.enc.Utf8));
        } catch (err) {
            console.error('Fail to decrypt user data ', err);
            return undefined;
        }
    }

    public static getUser(key: string = LsHelper.UserStorage): any {
        return LsHelper.getItem(key);
    }

    public static getUserPermissions(key: string = LsHelper.UserPermissionStorage): UserPermission[] {
        return LsHelper.getItem(key);
    }

    public static getUserRoles(key: string = LsHelper.UserRoleStorage): UserRole[] {
        return LsHelper.getItem(key);
    }

    public static getAccessToken(): string {
        const user: any = LsHelper.getUser();
        return user ? user.accessToken : '';
    }

    public static clearStorage(): void {
        this.etStorage.clear();
    }

    public static removeKey(key: string): void {
        this.etStorage.removeItem(key);
    }

    public static encryptData(data: any): string {
        const cipherData: CryptoJs.WordArray =
            CryptoJs.AES.encrypt(JSON.stringify(data), LsHelper.HrmData);
        return cipherData.toString();
    }

    public static decryptData(data: string): any {
        const bytes: CryptoJs.DecryptedMessage =
            CryptoJs.AES.decrypt(data, LsHelper.HrmData);
        return JSON.parse(bytes.toString(CryptoJs.enc.Utf8));
    }

    public static getPageSize(): number {
        const pageSize: string = localStorage.getItem(LsHelper.PAGE_SIZE);
        if (JsHelper.isNumber(pageSize)) {
            return parseInt(pageSize, 10);
        }
        return LsHelper.PAGE_SIZE_DEFAULT;
    }

    public static setPageSize(page: number): void {
        localStorage.setItem(LsHelper.PAGE_SIZE, page.toString());
    }
}
