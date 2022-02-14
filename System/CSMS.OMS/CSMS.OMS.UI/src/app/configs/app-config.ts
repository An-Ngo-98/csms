import { environment } from '../../environments/environment';

export class AppConfig {

    private protocol: string;
    public get Protocol(): string {
        return this.protocol;
    }

    private apiUrl: string;
    public get ApiUrl(): string {
        return this.apiUrl;
    }

    private homeUrl: string;
    public get HomeUrl(): string {
        return this.homeUrl;
    }

    private socketUrl: string;
    public get SocketUrl(): string {
        return this.socketUrl;
    }

    private appVersion: string;
    public get Version(): string {
        return this.appVersion;
    }

    public constructor() {
        this.appVersion = '1.1.0.0';
        switch (environment.env) {
            case 'production':
                this.protocol = 'http://';
                this.apiUrl = location.host;
                this.homeUrl = 'http://52.74.41.113:3001';
                this.socketUrl = 'http://52.74.41.113:4444';
                break;
            default:
                this.protocol = 'http://';
                // this.apiUrl = 'localhost:3001';
                this.apiUrl = '52.74.41.113:3001';
                this.homeUrl = 'http://localhost:4001';
                this.socketUrl = 'http://localhost:4444';
                break;
        }
    }
}
