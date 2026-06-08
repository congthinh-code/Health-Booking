import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../../../core/services/auth-service/auth.service';
import { Router, RouterLink } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  showPassword = false;
  
  // Trạng thái Popup điều khiển giống file PHP cũ
  showSuccessPopup = false;
  showErrorPopup = false;
  errorMessage = '';
  generatedCode = '';
  registeredEmail = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
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

  // Tự động thêm dấu gạch chéo '/' định dạng ngày sinh khi người dùng nhập dữ liệu từ bàn phím
  onNgaySinhInput(event: any) {
    let input = event.target.value.replace(/\D/g, ''); // Loại bỏ các ký tự không phải số
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

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.generatedCode = res.verifyCode;
          this.registeredEmail = res.email;
          this.showSuccessPopup = true; // Hiện popup báo thành công chứa OTP
        } else {
          this.errorMessage = res.message || 'Có lỗi xảy ra khi đăng ký!';
          this.showErrorPopup = true;
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || '❌ Kết nối máy chủ thất bại!';
        this.showErrorPopup = true;
      }
    });
  }

  goToVerify() {
    this.showSuccessPopup = false;
    // Chuyển sang trang kích hoạt kèm Email query parameter dữ liệu gốc
    this.router.navigate(['/verify'], { queryParams: { email: this.registeredEmail } });
  }
}
