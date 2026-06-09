import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule, isPlatformBrowser } from '@angular/common';       
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service/auth.service';
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit { 
  isMobileMenuOpen = false;
  isLoggedIn = false;
  userName = '';
  userAvatar = '';
  userRole = '';
  currentAvatar: string = 'assets/images/default-avatar.png';

  // 🔔 KHAI BÁO CÁC BIẾN CHUÔNG THÔNG BÁO THEO KHUÔN PHP
  isNotificationOpen = false; 
  unreadCount = 0;            
  notifications: any[] = [];  

  constructor(
    private authService: AuthService, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private http: HttpClient 
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      
      if (status && isPlatformBrowser(this.platformId)) {
        this.userName = localStorage.getItem('name') || sessionStorage.getItem('name') || 'Thành viên';
        this.userAvatar = localStorage.getItem('avatar') || sessionStorage.getItem('avatar') || '';
        const role = localStorage.getItem('role') || sessionStorage.getItem('role') || ''; 
        this.userRole = role.toLowerCase().trim(); 
        
        // Bốc UserId ra để đi lấy thông báo
        const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
        if (userId) {
          this.loadPhpStyleNotifications(Number(userId));
        }

        this.loadHeaderAvatar();
      } else {
        this.resetHeader();
      }
    });

    this.loadHeaderAvatar();
  }

  // Hàm gọi API lấy dữ liệu theo phong cách PHP
  loadPhpStyleNotifications(userId: number) {
    // 🔥 ĐẢM BẢO URL: /api/Notification/get-notifications/... (trùng khớp với C# ở trên)
    this.http.get<any>(`https://localhost:7291/api/Notification/get-notifications/${userId}`).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.notifications = res.notifications || [];
          this.unreadCount = res.unreadCount || 0;
          this.cdr.detectChanges(); 
        }
      },
      error: (err) => console.error('Lỗi lấy thông báo hệ thống:', err)
    });
  }

  // Bấm chuông ẩn hiện dropdown
  toggleNotification() {
    // 1. Đảo trạng thái Đóng/Mở của menu dropdown
    this.isNotificationOpen = !this.isNotificationOpen;
    
    // 2. Nếu mở chuông ra và thấy đang có số thông báo mới (unreadCount > 0), ta xóa số đi
    if (this.isNotificationOpen && this.unreadCount > 0) {
      this.unreadCount = 0;
    }
    
    // 3. Ép giao diện vẽ lại ngay lập tức
    this.cdr.detectChanges();
  }

  resetHeader() {
    this.userName = '';
    this.userAvatar = '';
    this.userRole = '';
    this.currentAvatar = 'assets/images/default-avatar.png';
    this.unreadCount = 0;
    this.notifications = [];
    this.isNotificationOpen = false;
  }

  loadHeaderAvatar() {
    // 1. Lấy ảnh real-time nếu người dùng vừa mới thực hiện đổi avatar ở trang cá nhân
    let avatarToDisplay = localStorage.getItem('userAvatar') || sessionStorage.getItem('userAvatar');

    // 2. Nếu 'userAvatar' chưa có (lúc mới đăng nhập xong), bốc ngay cái key 'avatar' từ login.ts
    if (!avatarToDisplay || avatarToDisplay === 'undefined' || avatarToDisplay === 'null' || avatarToDisplay === '') {
      avatarToDisplay = localStorage.getItem('avatar') || sessionStorage.getItem('avatar');
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

  loadHeaderAvatar() {
    if (!isPlatformBrowser(this.platformId)) return;
    let avatarToDisplay = localStorage.getItem('userAvatar') || localStorage.getItem('avatar') || sessionStorage.getItem('avatar');
    if (avatarToDisplay && avatarToDisplay !== 'undefined' && avatarToDisplay !== 'null' && avatarToDisplay.trim() !== '') {
      this.currentAvatar = avatarToDisplay.startsWith('/uploads') ? `https://localhost:7291${avatarToDisplay}` : avatarToDisplay;
    } else {
      this.currentAvatar = 'assets/images/default-avatar.png';
    }
    this.cdr.detectChanges();
  }
}