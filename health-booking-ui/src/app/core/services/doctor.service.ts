import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private baseUrl = 'https://localhost:7xxx/api'; // ← đổi port cho đúng

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctor/dashboard`);
  }

  getDoctorById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctors/${id}`);
  }

  getHospitals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/hospitals`);
  }

  getSpecializations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/specializations`);
  }

  updateDoctor(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/doctors/${id}`, data);
  }

  uploadAvatar(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatarFile', file);
    return this.http.post(`${this.baseUrl}/doctors/${id}/avatar`, formData);
  }

  confirmAppointment(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointments/${id}/confirm`, {});
  }

  rejectAppointment(id: number, reason: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointments/${id}/reject`, { reason });
  }
}