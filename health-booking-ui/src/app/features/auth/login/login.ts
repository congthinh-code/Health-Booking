import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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

  constructor(private authService: AuthService, private router: Router) { }

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
        console.log('Dữ liệu Server trả về khi login:', res);

        // 1. Kiểm tra success từ server
        if (res && res.success) {
          // 2. Lấy dữ liệu an toàn (xử lý case-insensitive)
          const userId = res.userId || res.UserId || res.userid;
          const name = res.name || res.Name || 'Thành viên';
          const avatar = res.avatar || res.Avatar || '';
          const role = (res.role || res.Role || 'patient').toLowerCase().trim();

          // 3. Xử lý lưu trữ (Chọn 1 trong 2: localStorage hoặc sessionStorage)
          // Khuyên dùng: Dùng sessionStorage nếu muốn bảo mật hơn (tự xóa khi đóng tab)
          // Khuyên dùng: Dùng localStorage nếu muốn duy trì đăng nhập sau khi tắt trình duyệt
          const storage = localStorage; // Hoặc localStorage tùy nhu cầu
          
          storage.setItem('user_id', userId.toString());
          storage.setItem('name', name);
          storage.setItem('avatar', avatar);
          storage.setItem('role', role);

          // 4. Cập nhật trạng thái và điều hướng
          this.authService.setLoggedInStatus(true);
          this.router.navigate(['/']);
        } else {
          alert(res.message || 'Sai tài khoản hoặc mật khẩu!');
        }
      },
      error: (err) => {
        if (err.error?.isNotVerified) {
          this.router.navigate(['/verify'], { queryParams: { email: this.email } });
        } else {
          alert(err.error?.message || 'Không thể kết nối server!');
        }
      }
    });
  }
}
