import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LhService {
  
  private baseUrl = 'https://localhost:7291/api/lh'; 

  constructor(private http: HttpClient) { }

  // Lấy danh sách bệnh viện có phân trang
  getCSYT(page: number, pageSize: number): Observable<any> {
    return this.http.get('https://localhost:7291/api/lh/csyt?page=' + page + '&pageSize=' + pageSize);
  }

  // Lấy danh sách quảng cáo (5 bệnh viện)
  getQC(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7291/api/lh/qc');
  }

  // Lấy danh sách tuyển dụng
  getTD(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7291/api/lh/td');
}

  // Lấy chi tiết 1 công việc
  getJobDetail(id: number): Observable<any> {
    return this.http.get('https://localhost:7291/api/lh/job-detail/' + id);
  }
}
