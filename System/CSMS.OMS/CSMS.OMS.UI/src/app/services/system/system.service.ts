import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import { CsmsDefaultFile } from 'app/models/system-data';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  private readonly defaultFilesCdnUrl = AppService.getPath(ApiController.CdnApi.DefaultFiles);

  constructor(private http: HttpClient) { }

  public getListDefaultFile(): Observable<CsmsDefaultFile[]> {
    return this.http.get(this.defaultFilesCdnUrl)
      .pipe(
        map((res: CsmsDefaultFile[]) => res)
      );
  }

  public saveDefaultPhoto(defaultFileType: string, title: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.defaultFilesCdnUrl + defaultFileType + '/' + title, formData)
      .pipe(
        map((res: any) => res)
      );
  }
}
