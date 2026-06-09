import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core'; // 🔥 Đã thêm OnInit, Inject
import { CommonModule, isPlatformBrowser } from '@angular/common';       // 🔥 Đã thêm isPlatformBrowser
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit { // 🔥 Đã thêm "implements OnInit"
  isMobileMenuOpen = false;
  isLoggedIn = false;
  userName = '';
  userAvatar = '';
  userRole = '';

  constructor(
    private authService: AuthService, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Luôn lắng nghe trạng thái từ AuthService phát ra
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      
      // Chỉ đọc localStorage nếu đang chạy trên Trình duyệt (Browser) và status = true
      if (status && isPlatformBrowser(this.platformId)) {
        
        // Đọc lại chính xác các key bạn đã lưu lúc Đăng nhập thành công
        this.userName = sessionStorage.getItem('name') || 'Thành viên';
        this.userAvatar = sessionStorage.getItem('avatar') || '';
        
        const role = sessionStorage.getItem('role') || '';
        this.userRole = role.toLowerCase().trim(); // Xóa khoảng trắng và đưa về chữ thường
        
        // 💡 DÒNG LOG KIỂM TRA:
        console.log('Đã khôi phục Header thành công:', {
          name: this.userName,
          role: this.userRole
        });

      } else {
        // Reset sạch dữ liệu khi logout hoặc chưa đăng nhập
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