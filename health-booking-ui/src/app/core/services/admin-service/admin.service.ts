import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://localhost:7291/api/admin'; // Điều chỉnh port của bạn

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard-stats`);
  }

  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/doctors`);
  }

  updateDoctor(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/doctors/${id}`, data);
  }

  getPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients`);
  }

  updatePatient(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/patients/${id}`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }

  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments`);
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/appointments/${id}`);
  }

  // Trong file admin.service.ts của bạn, bổ sung thêm hàm này:
  confirmAppointment(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/appointments/${id}/confirm`, {});
  }
}