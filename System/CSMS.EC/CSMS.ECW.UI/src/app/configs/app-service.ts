import { AppConfig } from './app-config';

export class AppService {
    private static appConfig: AppConfig = new AppConfig();

    public static getHomeUrl(): string {
        return this.appConfig.HomeUrl;
    }

    public static getApiUrl(): string {
        return this.appConfig.ApiUrl;
    }

    public static getVersion(): string {
        return this.appConfig.Version;
    }

    public static getPath(value: string): string {
        const apiCluster: string = this.appConfig.Protocol + this.appConfig.ApiUrl;
        return apiCluster + value;
    }
}
