import { JsHelper } from './js.helper';
export class LsHelper {
    public static readonly HrmData: string = 'csms_data';
    public static readonly HrmStoragePassport: string = 'HrmStoragePassport';
    public static readonly UserPermissionStorage: string = 'csms_user_permission';
    public static readonly UserRoleStorage: string = 'csms_user_role';
    public static readonly UserStorage: string = 'csms_user';

    public static readonly PAGE_SIZE: string = 'PAGE_SIZE';
    public static readonly PAGE_SIZE_DEFAULT = 10;

    private static etStorage: Storage = localStorage;

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
