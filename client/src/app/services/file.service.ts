import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private hostUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadFile(file: File, endpoint: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.hostUrl + endpoint, formData);
  }

  uploadFiles(files: File[], endpoint: string): Observable<any> {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    return this.http.post(this.hostUrl + endpoint, formData);
  }

  async loadFilesFromUrls(pictureUrls: string[]) {
    const files = await Promise.all(
      pictureUrls.map(async (url) => {
        const res = await fetch(url);
        const file = await res.blob();
        return file;
      })
    );
    return files as File[];
  }
}
