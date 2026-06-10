import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  doctor: any = null;
  appointments: any[] = [];
  total = 0;
  pending = 0;
  completed = 0;
  cancelled = 0;

  constructor(private doctorService: DoctorService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const userId = Number(sessionStorage.getItem('user_id') || localStorage.getItem('user_id'));
    const localName = localStorage.getItem('name') || sessionStorage.getItem('name') || '';
    let localAvatar = localStorage.getItem('userAvatar') || localStorage.getItem('avatar') || sessionStorage.getItem('avatar') || '';

    if (localAvatar === 'null' || localAvatar === 'undefined' || localAvatar.trim() === '') {
    localAvatar = 'assets/images/default-avatar.png';
  }

    if (localName) {
    this.doctor = {
      doctorId: 0, // Tạm thời để 0, API trả về sẽ đè lên sau
      fullName: localName,
      avatar: localAvatar,
      specialization: null, // Hiện trước khung trống hoặc chữ "Đang tải..."
      hospital: null,
      experienceYears: 0
    };
    this.cdr.detectChanges(); // Cập nhật view ngay sau khi gán dữ liệu từ localStorage
  }

    this.doctorService.getDashboard(userId).subscribe({
      next: (data) => {
        this.doctor = data.doctor;
        this.appointments = data.appointments;
        this.total = data.total;
        this.pending = data.pending;
        this.completed = data.completed;
        this.cancelled = data.cancelled;
        this.cdr.detectChanges(); // Cập nhật view sau khi nhận dữ liệu từ API
      },
      error: (err) => console.error('Lỗi load dashboard:', err)
    });
  }

  getAvatarUrl(avatar: string): string {
  // 1. Nếu dính chuỗi ma rác hoặc rỗng, trả về ảnh mặc định nằm ở assets
  if (!avatar || avatar === 'undefined' || avatar === 'null' || avatar.trim() === '') {
    return 'assets/images/anhbacsi/anhbs1.jpg'; // Thay bằng file ảnh có thật của bạn
  }

  // 2. Nếu chuỗi đã chứa đường dẫn assets/ sẵn hoặc link http/https tuyệt đối từ C# thì trả về dùng luôn
  if (avatar.startsWith('assets/') || avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar;
  }

  // 3. Nếu là đường dẫn tương đối do database .NET trả về (ví dụ: /uploads/avatars/...)
  if (avatar.startsWith('/uploads')) {
    return `http://localhost:5213${avatar}`; // Khớp đúng cổng 5213 từ file DoctorsController.cs của bạn
  }

  // 4. 🌟 ĐÃ SỬA: Khớp đúng với cấu trúc thư mục public/assets/images/anhbacsi của bạn
  if (avatar.includes('anhbs')) {
    return `assets/images/anhbacsi/${avatar}`; 
  }

  // Dự phòng nếu có lưu key khác
  return `assets/images/userAvatar/${avatar}`;
}

  confirmApp(id: number) {
    if (confirm('Bạn có chắc chắn muốn xác nhận lịch hẹn này không?')) {
      this.doctorService.confirmAppointment(id).subscribe({
        next: (data) => {
          alert(data.message);
          this.ngOnInit(); // reload lại data
        },
        error: () => alert('Lỗi kết nối tới máy chủ!')
      });
    }
  }

  rejectApp(id: number) {
    const reason = prompt('Nhập lý do từ chối lịch khám này:');
    if (reason === null) return;
    if (reason.trim() === '') {
      alert('Vui lòng nhập lý do để tiếp tục từ chối lịch khám!');
      return;
    }

    this.doctorService.rejectAppointment(id, reason).subscribe({
      next: (data) => {
        alert(data.message);
        this.ngOnInit();
      },
      error: () => alert('Lỗi kết nối tới máy chủ!')
    });
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    this.doctorService.uploadAvatar(this.doctor.doctorId, file).subscribe({
      next: (res) => {
        if (res && res.avatarUrl) {
          sessionStorage.setItem('avatar', res.avatarUrl);
          localStorage.setItem('userAvatar', res.avatarUrl);
          window.dispatchEvent(new Event('avatarUpdated'));
        }
        this.ngOnInit();
      },
      error: () => alert('Upload avatar thất bại!')
    });
  }
}