import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
    private hostUrl = "https://localhost:5002/api/";

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
}