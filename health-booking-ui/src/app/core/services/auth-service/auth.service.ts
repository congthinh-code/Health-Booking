import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7291/api/auth'; 
  
  // 1. Cứ khởi tạo giá trị mặc định ban đầu là false
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // 2. 🔥 ÉP KIỂM TRA LẠI: Ngay khi Service được khởi tạo ở Client (Trình duyệt), 
    // chúng ta phát lại giá trị chính xác thực tế từ sessionStorage
    if (isPlatformBrowser(this.platformId)) {
      const hasUser = sessionStorage.getItem('user_id') !== null;
      this.loggedInSubject.next(hasUser);
    }
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  verify(data: { email: string, verifyCode: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, data);
  }

  resendCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-code`, { email });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.clear();
    }
    this.setLoggedInStatus(false);
    this.router.navigate(['/']);
  }

  setLoggedInStatus(status: boolean) {
    this.loggedInSubject.next(status);
  }
}