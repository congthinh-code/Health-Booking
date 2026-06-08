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
  
  // Khởi tạo BehaviorSubject dựa trên token thực tế
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  // Inject PLATFORM_ID để kiểm tra môi trường Browser/Server tránh lỗi SSR
  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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
      localStorage.clear(); // Xóa sạch bộ nhớ tạm browser
    }
    
    this.setLoggedInStatus(false); // 1. Phát tín hiệu Đã đăng xuất trước để Header ẩn tên User ngay lập tức
    this.router.navigate(['/']);   // 2. Chuyển hướng về trang chủ sau
  }

  // Kiểm tra an toàn xem có user_id trong localStorage không
  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('user_id') !== null;
    }
    return false;
  }

  // Hàm cập nhật trạng thái đăng nhập cho toàn ứng dụng
  setLoggedInStatus(status: boolean) {
    this.loggedIn.next(status);
  }
}