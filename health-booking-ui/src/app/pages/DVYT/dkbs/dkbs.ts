import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface Specialization {
  name: string;
}

export interface Hospital {
  name: string;
  address?: string;
}

export interface User {
  userId?: number;
  email: string;
  role: string;
}

export interface Doctor {
  doctorId: number;
  fullName: string;
  avatar?: string;
  experienceYears?: number;
  description?: string;
  phone?: string;
  specialization?: Specialization;
  hospital?: Hospital;
  user?: User;
}

@Component({
  selector: 'app-dkbs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './dkbs.html',
  styleUrl: './dkbs.css',
})
export class Dkbs implements OnInit {
  doctors: Doctor[] = [];
  selectedDoctor: Doctor | null = null;
  
  isLoggedIn = false;
  userRole = '';
  isModalOpen = false;
  
  bookingData = { doctorId: 0, doctorName: '', date: '', time: '' };

  currentPage = 1;
  itemsPerPage = 4;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadDoctors();
  }

  checkLoginStatus(): void {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('UserId') || sessionStorage.getItem('UserId');
      const role = localStorage.getItem('Role') || sessionStorage.getItem('Role');
      this.isLoggedIn = !!userId;
      this.userRole = role || '';
    }
  }

  loadDoctors(): void {
    this.http.get<Doctor[]>('http://localhost:5213/api/doctors').subscribe({
      next: (data) => {
        this.doctors = data;
        this.setSelectedDoctorFromQuery();
      },
      error: (err) => {
        console.warn('Không kết nối được API Backend. Kích hoạt dữ liệu dự phòng DB Seed...', err);
        this.doctors = [
          {
            doctorId: 1,
            fullName: 'BS CKII. Ngô Trung Nam',
            avatar: 'anhbs3.jpg',
            experienceYears: 10,
            description: 'Chuyên khoa Tim Mạch',
            phone: '0901 234 501',
            specialization: { name: 'Nội tim mạch' },
            hospital: { name: 'Bệnh viện đa khoa tỉnh Bình Định', address: '106 Nguyễn Huệ, Phường Quy Nhơn, Tỉnh Gia Lai' },
            user: { email: 'ngotrungnam@healthbooking.com', role: 'Doctor' }
          },
          {
            doctorId: 2,
            fullName: 'BS CKI. Nguyễn Thị Thanh Minh',
            avatar: 'anhbs1.jpg',
            experienceYears: 5,
            description: 'Chuyên khoa Tim mạch',
            phone: '0901 234 502',
            specialization: { name: 'Nội tim mạch' },
            hospital: { name: 'Trung tâm Y tế Quy Nhơn', address: '114 Trần Hưng Đạo, phường Quy Nhơn, tỉnh Gia Lai' },
            user: { email: 'nguyenthithanhminh@healthbooking.com', role: 'Doctor' }
          },
          {
            doctorId: 3,
            fullName: 'BS CKI. Nguyễn Phúc Thiện',
            avatar: 'anhbs5.jpg',
            experienceYears: 8,
            description: 'Chuyên khoa Tai Mũi Họng',
            phone: '0901 234 503',
            specialization: { name: 'Tai mũi họng' },
            hospital: { name: 'Bệnh viện Mắt Bình Định', address: '78 Trần Hưng Đạo, Quy Nhơn, Gia Lai' },
            user: { email: 'nguyenphucthien@healthbooking.com', role: 'Doctor' }
          },
          {
            doctorId: 4,
            fullName: 'BS CKI. Đỗ Đăng Khoa',
            avatar: 'anhbs6.jpg',
            experienceYears: 7,
            description: 'Chuyên khoa Sản - Phụ khoa',
            phone: '0901 234 504',
            specialization: { name: 'Sản - Phụ khoa' },
            hospital: { name: 'Bệnh viện đa khoa tỉnh Bình Định', address: '106 Nguyễn Huệ, Phường Quy Nhơn, Tỉnh Gia Lai' },
            user: { email: 'dodangkhoa@healthbooking.com', role: 'Doctor' }
          }
        ];
        this.setSelectedDoctorFromQuery();
      }
    });
  }

  setSelectedDoctorFromQuery(): void {
    this.route.queryParams.subscribe(params => {
      const doctorId = +params['doctorId'];
      if (doctorId) {
        this.selectedDoctor = this.doctors.find(d => d.doctorId === doctorId) || null;
      }
    });
  }

  getAvatarPath(avatar?: string): string {
    return avatar ? `assets/images/anhbacsi/${avatar}` : 'assets/images/doctor.png';
  }

  onImgError(event: any): void {
    event.target.src = 'assets/images/doctor.png';
  }

  get paginatedDoctors(): Doctor[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.doctors.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.doctors.length / this.itemsPerPage);
  }

  get paginationPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  setPage(page: number): void {
    this.currentPage = page;
  }

  openModal(id: number, name: string): void {
    if (!this.isLoggedIn) {
      if (confirm('Vui lòng đăng nhập để đặt khám bác sĩ!')) {
        this.router.navigate(['/account/login']);
      }
      return;
    }

    if (this.userRole !== 'patient') {
      alert('Vui lòng đăng nhập với tài khoản Bệnh nhân để đặt khám!');
      return;
    }

    this.bookingData = { doctorId: id, doctorName: name, date: '', time: '' };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onBookingSubmit(): void {
    const body = new URLSearchParams({
      doctorId: this.bookingData.doctorId.toString(),
      date: this.bookingData.date,
      time: this.bookingData.time
    });

    this.http.post<any>('http://localhost:5213/api/appointments', body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).subscribe({
      next: (data) => {
        if (data.success) {
          alert('Đặt lịch khám bác sĩ thành công!');
          this.closeModal();
        } else {
          alert('Lỗi: ' + data.message);
        }
      },
      error: () => alert('Có lỗi hệ thống xảy ra khi đặt khám!')
    });
  }
}