import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


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
    private readonly baseUrl =  environment.apiUrl;;
  // private readonly baseUrl = 'http://localhost:3000';
  // private readonly baseUrl = 'http://172.16.50.100:3000';
  // private readonly baseUrl = 'http://localhost:5025';
  // private readonly baseUrl = 'http://172.16.50.7:5025'; // Live
  constructor(private readonly http: HttpClient) { }

  // saveJson(filename: string, data: any): Observable<ApiResponse<any>> {
  //   return this.http.post<ApiResponse<any>>(`${this.baseUrl}/save-json`, { filename, data });
  // }

  // // ✅ Get list of files
  // getFiles(): Observable<ApiResponse<string[]>> {
  //   return this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/files`);
  // }

  // // ✅ Get file content by name
  // getFile(name: string): Observable<ApiResponse<any>> {
  //   return this.http.get<ApiResponse<any>>(`${this.baseUrl}/file/${name}`);
  // }

  // // ✅ Update file content
  // updateFile(name: string, newName: string, data: any): Observable<ApiResponse<any>> {
  //   return this.http.put<ApiResponse<any>>(`${this.baseUrl}/file/${name}`, { newName, data });
  // }

  // // ✅ Delete file
  // deleteFile(name: string): Observable<ApiResponse<any>> {
  //   return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/file/${name}`);
  // }


  // ✅ Save JSON (filename is optional, server will generate if not provided)
  saveJson(displayName: string, data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/save-json`, { displayName, data });
  }

  // ✅ Get list of files (from metadata)
  getFiles(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/files`);
  }

  // ✅ Get file content by ID
  getFile(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/file/${id}`);
  }

  // ✅ Update file content (id + optional newFilename)
  updateFile(id: string, data: any, newDisplayName?: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/file/${id}`, { data, newDisplayName });
  }

  // ✅ Delete file by ID
  deleteFile(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/file/${id}`);
  }

  getConfig(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/config`);
  }

  // ✅ Save/update config
  saveConfig(config: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/config`, config);
  }
}
