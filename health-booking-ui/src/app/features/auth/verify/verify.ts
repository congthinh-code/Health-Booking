import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
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
    this.authService.verify({ email: this.email, verifyCode: this.verifyCode }).subscribe({
      next: (res) => {
        alert(res.message);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isError = true;
        this.message = err.error.message || 'Xác minh lỗi';
      }
    });
  }

  onResendCode() {
    this.authService.resendCode(this.email).subscribe({
      next: (res) => {
        this.isError = false;
        this.message = res.message;
        this.newCodeDisplay = res.newCode;
      },
      error: (err) => {
        this.isError = true;
        this.message = err.error.message || 'Lỗi gửi lại mã';
      }
    });
  }
}
