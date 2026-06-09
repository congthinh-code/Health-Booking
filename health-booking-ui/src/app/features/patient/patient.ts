import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router'; // 🔥 Đã thêm Router để chuyển hướng nếu chưa đăng nhập
import { forkJoin } from 'rxjs'; 

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './patient.html',
  styleUrls: ['./patient.css'] 
})
export class PatientComponent implements OnInit {
  private baseUrl = 'https://localhost:7291/api/patient'; 
  
  profileData: any = {
    userId: 0,
    fullName: '',
    email: '',
    phone: '',
    address: '',
    avatar: 'assets/images/default-avatar.png'
  };

  currentFilter: string = 'all';

  allAppointments: any[] = [];
  filteredAppointments: any[] = [];
  bookingRequests: any[] = [];
  stats: any = { total: 0, pending: 0, completed: 0, cancelled: 0 };

  // 🔥 Đã inject thêm Router vào constructor
  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
  let loggedInUserId = 0;

  // 1. CHỦ ĐỘNG ĐỌC KEY 'user_id' MÀ FILE LOGIN ĐANG LƯU
  const storedId = localStorage.getItem('user_id');
  
  if (storedId) {
    loggedInUserId = parseInt(storedId, 10);
  } else {
    // Dự phòng nếu sau này có dùng cục 'user' hoặc 'currentUser' object
    const userJson = localStorage.getItem('currentUser') || localStorage.getItem('user');
    if (userJson) {
      try {
        const loggedInUser = JSON.parse(userJson);
        loggedInUserId = loggedInUser.userId || loggedInUser.id || loggedInUser.UserId;
      } catch (e) {
        console.error("Lỗi parse JSON", e);
      }
    }
  }

  // 2. KIỂM TRA CHỐT HẠ:
  if (!loggedInUserId || loggedInUserId === 0) {
    console.warn("⚠️ Không tìm thấy ID hợp lệ.");
    alert('Phiên làm việc đã hết hạn hoặc bạn chưa đăng nhập. Vui lòng đăng nhập lại nhen! 🔐');
    return; 
  }

  console.log("🚀 Thần kỳ chưa! Đã nhận đúng ID tài khoản vừa đăng nhập là:", loggedInUserId);
  this.loadRealDashboardData(loggedInUserId);
  this.cdr.detectChanges();
}

  // ==================== GỌI API THẬT TỪ DATABASE SQL SERVER ====================
  loadRealDashboardData(userId: number) {
    
    // 1. GỌI API PROFILE (Tách riêng ra để không bị ảnh hưởng bởi lịch hẹn)
    this.http.get<any>(`${this.baseUrl}/profile/${userId}`).subscribe({
      next: (res: any) => {
        if (res && res.success && res.model) {
          const data = res.model;
          
          let dbAvatar = data.avatar || data.Avatar || 'assets/images/default-avatar.png';
          
          if (dbAvatar.startsWith('/uploads')) {
            dbAvatar = `https://localhost:7291${dbAvatar}`;
          }
          
          // Nạp dữ liệu thực tế từ DB lên giao diện
          this.profileData = {
            userId: data.userId || data.UserId,
            fullName: data.fullName || data.FullName || 'Chưa cập nhật',
            email: data.email || data.Email || 'Chưa cập nhật',
            phone: data.phone || data.Phone || 'Chưa cập nhật',
            address: data.address || data.Address || 'Chưa cập nhật',
            avatar: dbAvatar
          };
          
          localStorage.setItem('userAvatar', dbAvatar);
          window.dispatchEvent(new Event('avatarUpdated'));

          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('❌ Lỗi không lấy được profile cá nhân từ API:', err);
      }
    });

    // 2. GỌI API LỊCH HẸN VÀ THỐNG KÊ 
    this.http.get<any>(`${this.baseUrl}/dashboard-data/${userId}`).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          this.allAppointments = res.appointments || [];
          this.filteredAppointments = [...this.allAppointments];
          this.stats = res.stats || { total: 0, pending: 0, completed: 0, cancelled: 0 };
          this.bookingRequests = res.bookingRequests || []; 
          
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.warn('⚠️ API dashboard-data đang bị lỗi hoặc chưa viết bên C#, nhưng thông tin cá nhân vẫn hiện bình thường nha!');
      }
    });
  }

  // ==================== BỘ LỌC NÚT BẤM TRÊN GIAO DIỆN DASHBOARD ====================
  filterAppointments(status: string) {
    this.currentFilter = status;
    
    if (status === 'all') {
      this.filteredAppointments = [...this.allAppointments];
    } else if (status === 'pending') {
      this.filteredAppointments = this.allAppointments.filter(a => a.status === 0); 
    } else if (status === 'completed') {
      this.filteredAppointments = this.allAppointments.filter(a => a.status === 2); 
    } else if (status === 'cancelled') {
      this.filteredAppointments = this.allAppointments.filter(a => a.status === 3); 
    }
    
    this.cdr.detectChanges(); 
  }

  getStatusText(statusNum: number): string {
    switch (statusNum) {
      case 0: return 'Chờ xác nhận';
      case 1: return 'Đã xác nhận';
      case 2: return 'Hoàn thành';
      case 3: return 'Đã hủy';
      default: return 'Không xác định';
    }
  }

  // ==================== API POST: UPLOAD ẢNH ĐẠI DIỆN THẬT LÊN WWWROOT ====================
  onAvatarSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatarFile', file);

    // 🔥 ĐÃ SỬA: Lấy chuẩn đét theo ID động của chính tài khoản này, nếu trống thì không cho chạy bừa
    const userId = this.profileData.userId; 
    if (!userId || userId === 0) {
      alert('Không tìm thấy thông tin tài khoản hợp lệ để upload ảnh! ❌');
      return;
    }

    this.http.post<any>(`${this.baseUrl}/upload-avatar/${userId}`, formData).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Thay đổi ảnh đại diện thành công! 🎉');
          this.profileData.avatar = res.avatarUrl; 
          localStorage.setItem('userAvatar', res.avatarUrl);
          window.dispatchEvent(new Event('avatarUpdated'));
          this.cdr.detectChanges(); 
        }
      },
      error: (err) => {
        alert('Lỗi upload avatar rồi bạn ơi!');
        console.error(err);
      }
    });
  }
}