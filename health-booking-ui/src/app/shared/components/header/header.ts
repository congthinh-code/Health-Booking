import { Component, ChangeDetectorRef } from '@angular/core';
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

  currentAvatar: string = 'assets/images/default-avatar.png';

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

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
        this.loadHeaderAvatar();
      } else {
        // Nếu đã đăng xuất, dọn sạch bộ nhớ biến trên giao diện thanh toán
        this.userName = '';
        this.userAvatar = '';
        this.userRole = '';
        this.currentAvatar = '';
      }
    });

    // 1. Lúc mới vào trang, lấy ảnh đã lưu từ trước ra hiển thị
    this.loadHeaderAvatar();

    // 2. LẮNG NGHE SỰ KIỆN: Khi bên trang Patient đổi ảnh, Header sẽ tự động chạy hàm này để cập nhật ảnh mới
    window.addEventListener('avatarUpdated', () => {
      this.loadHeaderAvatar();
    });
  }

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
  }

  loadHeaderAvatar() {
    // 1. Lấy ảnh real-time nếu người dùng vừa mới thực hiện đổi avatar ở trang cá nhân
    let avatarToDisplay = localStorage.getItem('userAvatar');

    // 2. Nếu 'userAvatar' chưa có (lúc mới đăng nhập xong), bốc ngay cái key 'avatar' từ login.ts
    if (!avatarToDisplay || avatarToDisplay === 'undefined' || avatarToDisplay === 'null' || avatarToDisplay === '') {
      avatarToDisplay = localStorage.getItem('avatar');
    }

    // 3. 🔥 ĐÃ SỬA LOGIC: Kiểm tra chuỗi sạch sẽ, loại bỏ hoàn toàn các trường hợp rỗng/null/undefined dạng chuỗi
    if (avatarToDisplay && 
        avatarToDisplay !== 'undefined' && 
        avatarToDisplay !== 'null' && 
        avatarToDisplay.trim() !== '') {
      
      // Dự phòng kiểm tra nếu C# trả về đường dẫn tương đối dạng '/uploads/...' thì nối domain vào
      if (avatarToDisplay.startsWith('/uploads')) {
        this.currentAvatar = `https://localhost:7291${avatarToDisplay}`;
      } else {
        this.currentAvatar = avatarToDisplay;
      }

    } else {
      // 🔥 Nếu trống hoàn toàn hoặc bằng rỗng, ép về ảnh mặc định rõ ràng để HTML hiển thị icon hoặc ảnh gốc
      this.currentAvatar = 'assets/images/default-avatar.png';
    }

    // Ép giao diện cập nhật và vẽ lại ảnh đại diện mới lập tức
    this.cdr.detectChanges();
  }
}
