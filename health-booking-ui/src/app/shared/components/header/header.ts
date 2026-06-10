import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, HostListener } from '@angular/core'; 
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

  // BIẾN CHUÔNG THÔNG BÁO
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
        
        // Lấy UserId để đi lấy thông báo
        const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
        if (userId) {
          this.loadPhpStyleNotifications(Number(userId));
        }

        this.loadHeaderAvatar();
      } else {
        this.resetHeader();
      }
    });
  }

  @HostListener('window:notificationUpdated', ['$event'])
  onNotificationUpdated(event: Event) {
    const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
    if (userId) {
      this.loadPhpStyleNotifications(Number(userId));
    }
  }

  // Hàm gọi API lấy dữ liệu thông báo từ backend .NET
  loadPhpStyleNotifications(userId: number) {
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
    this.isNotificationOpen = !this.isNotificationOpen;
    
    // Nếu mở chuông ra và thấy đang có số thông báo mới, ta tạm ẩn số đi trên UI
    // Gợi ý: Nên gọi thêm 1 API cập nhật trạng thái "Đã đọc" ở DB tại đây nếu cần thiết
    if (this.isNotificationOpen && this.unreadCount > 0) {
      this.markNotificationsAsRead();
    }
    
    this.cdr.detectChanges();
  }

  markNotificationsAsRead() {

  const userId =
    localStorage.getItem('user_id') ||
    sessionStorage.getItem('user_id');

  if (!userId) return;

  this.http.post(
    `https://localhost:7291/api/Notification/mark-as-read/${userId}`,
    {}
  ).subscribe({
    next: () => {
      this.unreadCount = 0;

      this.notifications.forEach(x => {
        x.isRead = true;
      });

      this.cdr.detectChanges();
    },
    error: err => {
      console.error('Lỗi cập nhật đã đọc', err);
    }
  });
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

  // Hàm xử lý Avatar chuẩn hóa, an toàn khi chạy SSR
  loadHeaderAvatar() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Ưu tiên lấy userAvatar (nếu mới cập nhật profile), sau đó đến avatar lúc login
    let avatarToDisplay = localStorage.getItem('userAvatar') || 
                          sessionStorage.getItem('userAvatar') || 
                          localStorage.getItem('avatar') || 
                          sessionStorage.getItem('avatar');

    if (avatarToDisplay && 
        avatarToDisplay !== 'undefined' && 
        avatarToDisplay !== 'null' && 
        avatarToDisplay.trim() !== '') {
      
      // Nếu là đường dẫn tương đối từ C#, nối domain local vào
      if (avatarToDisplay.startsWith('/uploads')) {
        this.currentAvatar = `https://localhost:7291${avatarToDisplay}`;
      } else {
        this.currentAvatar = avatarToDisplay;
      }
    } else {
      this.currentAvatar = 'assets/images/default-avatar.png';
    }
    
    this.cdr.detectChanges();
  }
  logout() {
    this.authService.logout();
    this.resetHeader();
  }
}