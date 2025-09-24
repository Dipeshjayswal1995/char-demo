import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  status: boolean;
  data: T | null;
  message: string;
  statusCode: number;
}


@Injectable({
  providedIn: 'root'
})
export class ApiServices {
  private readonly baseUrl = 'http://172.16.50.100:3000';
  constructor(private readonly http: HttpClient) { }

  saveJson(filename: string, data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/save-json`, { filename, data });
  }

  // ✅ Get list of files
  getFiles(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/files`);
  }

  // ✅ Get file content by name
  getFile(name: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/file/${name}`);
  }

  // ✅ Update file content
  updateFile(name: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/file/${name}`, { data });
  }

  // ✅ Delete file
  deleteFile(name: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/file/${name}`);
  }
}
