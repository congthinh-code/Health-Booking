import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private apiUrl = 'https://localhost:7291/api/Hospital';

  constructor(private http: HttpClient) { }

  getHospitals(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}