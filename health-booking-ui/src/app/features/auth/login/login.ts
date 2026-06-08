import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../../../core/services/auth-service/auth.service';
import { Router, RouterLink } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (!this.email || !this.password) {
      alert('⚠️ Vui lòng nhập đầy đủ tài khoản và mật khẩu!');
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.success) {
          // Lưu Session Storage giả lập tương tự PHP
          localStorage.setItem('user_id', res.userId.toString());
          localStorage.setItem('name', res.name);
          localStorage.setItem('avatar', res.avatar || '');
          
          // Ép toàn bộ Role về chữ thường theo đúng cấu trúc vận hành cũ: "admin", "doctor", "patient"
          const normalizeRole = res.role.toLowerCase();
          localStorage.setItem('role', normalizeRole);

          // Phát tín hiệu cập nhật Header tức thời
          this.authService.setLoggedInStatus(true);

          // Điều hướng quay về trang chủ hệ thống công cộng
          this.router.navigate(['/']);
        } else {
          alert(res.message || 'Sai tài khoản hoặc mật khẩu!');
        }
      },
      error: (err) => {
        if (err.error && err.error.isNotVerified) {
          // Nếu tài khoản chưa kích hoạt, điều hướng tự động sang trang nhập OTP
          this.router.navigate(['/verify'], { queryParams: { email: this.email } });
        } else {
          alert(err.error?.message || 'Không thể kết nối server!');
        }
      }
    });
  }
}
