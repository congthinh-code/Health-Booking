import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private baseUrl = `${API_BASE_URL}/api`;

  constructor(private http: HttpClient) {}

  getDashboard(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctors/dashboard/${userId}`);
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