import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs';
import { AppService } from 'app/configs/app-service';

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  private baseUrl = AppService.getApiUrl();
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    this.baseUrl = AppService.getApiUrl();
  }

  public getHttpOptions(_params, extraHeaders) {
    const httpOptions = {
      headers: this.getHeaders(undefined, extraHeaders),
      params: {},
    }
    if (_params) {
      const params = Object.assign(_params, {});
      for (const key in params) {
        if (!params[key] || params[key].length === 0) {
          delete params[key];
        }
      }
      httpOptions.params = params;
    }
    return httpOptions;
  }

  public get(url: string, params?: any, extraHeaders?: any): Observable<any> {
    const httpOptions = this.getHttpOptions(params, extraHeaders);
    const serviceUrl = this.modifyUrlForLocalRequest(url);
    return this.http.get(serviceUrl, httpOptions);
  }

  public post(url: string, params?: any, extraHeaders?: any): Observable<any> {
    const httpOptions = this.getHttpOptions(undefined, extraHeaders);
    const serviceUrl = this.modifyUrlForLocalRequest(url);
    return this.http.post(serviceUrl, params, httpOptions);
  }

  public update(url: string, params?: any, extraHeaders?: any): Observable<any> {
    const httpOptions = this.getHttpOptions(undefined, extraHeaders);
    const serviceUrl = this.modifyUrlForLocalRequest(url);
    return this.http.put(serviceUrl, params, httpOptions);
  }

  public put(url: string, params?: any, extraHeaders?: any): Observable<any> {
    const httpOptions = this.getHttpOptions(undefined, extraHeaders);
    const serviceUrl = this.modifyUrlForLocalRequest(url);
    return this.http.put(serviceUrl, params, httpOptions);
  }
  public delete(url: string, extraHeaders?: any): Observable<any> {
    const httpOptions = this.getHttpOptions(undefined, extraHeaders);
    const serviceUrl = this.modifyUrlForLocalRequest(url);
    return this.http.request('delete', serviceUrl, { ...httpOptions, body: extraHeaders });
  }

  public getHeaders(contentType = 'application/json', extraHeaders: any = {}): HttpHeaders {
    const authToken = this.localStorageService.getAuthToken();
    const headersObj = Object.assign(
      {
        Accept: contentType,
      },
      authToken ? { Authorization: `Bearer ${authToken}` } : {},
      extraHeaders,
    );
    return new HttpHeaders(headersObj);
  }

  private modifyUrlForLocalRequest(url: string): string {
    return url && url.indexOf(this.baseUrl) === -1 ? `${this.baseUrl}${url}` : url;
  }
}
