import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {RouterModule} from "@angular/router";
import { AuthService } from '../../../core/services/auth-service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // Thêm logic toggle mobile menu nếu cần
  isMobileMenuOpen = false;
  isLoggedIn = false;
  userName = '';
  userAvatar = '';
  userRole = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Lắng nghe trạng thái đăng nhập liên tục từ AuthService phát ra
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      
      if (status) {
        // Nếu đã đăng nhập, đọc thông tin phiên làm việc từ bộ nhớ trình duyệt
        this.userName = localStorage.getItem('name') || 'Thành viên';
        this.userAvatar = localStorage.getItem('avatar') || '';
        
        // Đọc role và chuẩn hóa về chữ thường để so sánh chính xác trên HTML (ví dụ: 'patient', 'doctor', 'admin')
        const role = localStorage.getItem('role') || '';
        this.userRole = role.toLowerCase();
      } else {
        // Nếu đã đăng xuất, dọn sạch bộ nhớ biến trên giao diện thanh toán
        this.userName = '';
        this.userAvatar = '';
        this.userRole = '';
      }
    });
  }

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
  }
}
