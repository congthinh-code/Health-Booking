import { Component, OnInit } from '@angular/core';
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

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.doctorService.getDashboard().subscribe({
      next: (data) => {
        this.doctor = data.doctor;
        this.appointments = data.appointments;
        this.total = data.total;
        this.pending = data.pending;
        this.completed = data.completed;
        this.cancelled = data.cancelled;
      },
      error: (err) => console.error('Lỗi load dashboard:', err)
    });
  }

  getAvatarUrl(avatar: string): string {
    if (!avatar) return '/images/doctor.png';
    if (avatar.includes('anhbs')) return `/images/anhbacsi/${avatar}`;
    return `/images/userAvatar/${avatar}`;
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
      next: () => this.ngOnInit(),
      error: () => alert('Upload avatar thất bại!')
    });
  }
}