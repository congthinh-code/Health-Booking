import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './verify.html',
  styleUrl: './verify.css',
})
export class Verify implements OnInit {
  email: string = '';
  verifyCode: string = '';
  message: string = '';
  isError: boolean = false;
  newCodeDisplay: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  onVerify() {
    if (!this.verifyCode) {
      alert('⚠️ Vui lòng nhập mã xác minh gồm 6 chữ số!');
      return;
    }

    this.authService.verify({ email: this.email, verifyCode: this.verifyCode }).subscribe({
      next: (res) => {
        alert(res.message);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isError = true;
        this.message = err.error?.message || 'Mã xác minh không chính xác!';
      }
    });
  }

  // Gộp tất cả logic gửi lại mã vào duy nhất 1 hàm sạch sẽ, ánh xạ đồng bộ với Backend
  onResendCode() {
    if (!this.email) {
      alert('❌ Không tìm thấy thông tin email cần gửi lại mã!');
      return;
    }

    // 🔥 TRUYỀN ĐÚNG ĐỐI TƯỢNG ĐỂ BACKEND .NET KHÔNG BÁO LỖI 400
    const bodyData = { email: this.email };

    this.authService.resendCode(this.email).subscribe({
      next: (res) => {
        this.isError = false;
        this.message = res.message;
        
        // Hiện mã trực tiếp ra màn hình ở môi trường Dev cho tiện test
        if (res.newCode) {
          this.newCodeDisplay = res.newCode;
          alert(`✅ Mã xác minh mới của bạn là: ${res.newCode}`);
        }
      },
      error: (err) => {
        this.isError = true;
        this.message = err.error?.message || 'Lỗi hệ thống khi gửi lại mã!';
      }
    });
  }
}