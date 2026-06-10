import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true, // Nếu dự án của bạn là standalone
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  showPassword = false;

  showSuccessPopup = false;
  showErrorPopup = false;
  errorMessage = '';
  registeredEmail = '';
  generatedCode = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group({
      hoten: ['', Validators.required],
      ngaysinh: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sodienthoai: [''],
      diachi: [''],
      matkhau: ['', Validators.required],
      role: ['patient', Validators.required]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onNgaySinhInput(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 2 && input.length <= 4) {
      input = input.slice(0, 2) + '/' + input.slice(2);
    } else if (input.length > 4) {
      input = input.slice(0, 2) + '/' + input.slice(2, 4) + '/' + input.slice(4, 8);
    }
    this.registerForm.patchValue({ ngaysinh: input }, { emitEvent: false });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = '⚠️ Vui lòng điền đầy đủ các thông tin bắt buộc!';
      this.showErrorPopup = true;
      return;
    }

    const form = this.registerForm.value;
    this.registeredEmail = form.email;

    const password: string = form.matkhau || '';
    const passwordPattern = /^[A-Z].*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]$/;
    if (!passwordPattern.test(password)) {
      this.errorMessage = 'Mật khẩu phải bắt đầu bằng chữ in hoa và kết thúc bằng ký tự đặc biệt (ví dụ: Abc123!).';
      this.showErrorPopup = true;
      return;
    }

    const registerData = {
      hoTen: form.hoten,
      ngaySinh: form.ngaysinh,
      email: form.email,
      soDienThoai: form.sodienthoai || '',
      diaChi: form.diachi || '',
      matKhau: form.matkhau,
      role: form.role
    };

    this.authService.register(registerData).subscribe({
      next: (res) => {
        setTimeout(() => {
          if (res.success) {
            this.generatedCode = res.verifyCode; // Lấy đúng mã từ .NET API
            this.showSuccessPopup = true;        // Mở popup chứa mã lên để người dùng xem

            // ❌ BỎ dòng router.navigate ở đây để trang không bị chuyển đi mất
          } else {
            this.errorMessage = res.message;
            this.showErrorPopup = true;
          }
          this.cdr.detectChanges();
        }, 50);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Có lỗi hệ thống xảy ra khi đăng ký!';
        this.showErrorPopup = true;
        this.cdr.detectChanges();
      }
    });
  }

  // Khi người dùng xem mã xong và bấm nút "Xác thực ngay" trên Popup
  goToVerify() {
    this.showSuccessPopup = false;
    // 🔥 Lúc này mới chính thức chuyển trang và truyền email kèm mã code sang làm mồi điền tự động
    // 🔥 SỬA LẠI THÀNH:
    this.router.navigate(['/verify'], { queryParams: { email: this.registeredEmail } });
  }
}