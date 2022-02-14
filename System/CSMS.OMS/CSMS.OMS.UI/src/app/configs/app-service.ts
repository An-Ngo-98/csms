import { AppConfig } from './app-config';
import { ApiController } from '../commons/consts/api-controller.const';

export class AppService {
    private static appConfig: AppConfig = new AppConfig();

    public static getHomeUrl(): string {
        return this.appConfig.HomeUrl;
    }

    public static getSocketUrl(): string {
        return this.appConfig.SocketUrl;
    }

    public static getVersion(): string {
        return this.appConfig.Version;
    }

    public static getPath(value: string): string {
        const apiCluster: string = this.appConfig.Protocol + this.appConfig.ApiUrl;
        return apiCluster + value;
    }
}
