import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core'; // 🔥 Đã thêm OnInit, Inject
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

  currentAvatar: string = 'assets/images/default-avatar.png';
  constructor(
    private authService: AuthService, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
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
        
        const role = sessionStorage.getItem('role') || ''; // code thảo là localStorage
        this.userRole = role.toLowerCase().trim(); // Xóa khoảng trắng và đưa về chữ thường
        this.loadHeaderAvatar();
        
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
