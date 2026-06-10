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
  isLoading = true; // dùng để phân biệt "đang tải" vs "không có lịch hẹn"

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
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi load dashboard:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getAvatarUrl(avatar: string): string {
    // 1. Nếu rỗng hoặc chuỗi rác → ảnh mặc định
    if (!avatar || avatar === 'undefined' || avatar === 'null' || avatar.trim() === '') {
      return 'assets/images/anhbacsi/anhbs1.jpg';
    }
    // 2. Đã là link tuyệt đối hoặc assets/ → dùng ngay
    if (avatar.startsWith('assets/') || avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar;
    }
    // 3. Đường dẫn /uploads/... do backend C# trả về → ghép với base URL đúng (https:7291)
    if (avatar.startsWith('/uploads')) {
      return `https://localhost:7291${avatar}`;
    }
    // 4. Tên file ảnh bác sĩ tĩnh (anhbs1.jpg, ...)
    if (avatar.includes('anhbs')) {
      return `assets/images/anhbacsi/${avatar}`;
    }
    // Dự phòng
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