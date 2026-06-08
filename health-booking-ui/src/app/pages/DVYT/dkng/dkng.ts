import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface Specialization {
  name: string;
}

export interface Hospital {
  hospitalId: number;
  name: string;
  address: string;
  description?: string;
  hotline?: string;
  image?: string;
  websiteUrl?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
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
}

@Component({
  selector: 'app-dkng',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './dkng.html',
  styleUrl: './dkng.css',
})
export class Dkng implements OnInit {
  hospitals: Hospital[] = [];
  doctors: Doctor[] = [];
  
  isLoggedIn = false;
  userRole = '';
  isModalOpen = false;
  displayMode: 'hospital' | 'doctor' = 'hospital';

  bookingData = { id: 0, name: '', date: '', time: '', specialty: '' };

  currentPage = 1;
  itemsPerPage = 4;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadData();
  }

  checkLoginStatus(): void {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('UserId') || sessionStorage.getItem('UserId');
      const role = localStorage.getItem('Role') || sessionStorage.getItem('Role');
      this.isLoggedIn = !!userId;
      this.userRole = role || '';
    }
  }

  loadData(): void {
    this.http.get<Hospital[]>('http://localhost:5213/api/hospitals').subscribe({
      next: (data) => {
        // Ánh xạ thêm các trường giao diện nếu API chưa cung cấp
        this.hospitals = data.map(h => ({
          ...h,
          rating: 0,
          reviewCount: 0,
          isVerified: h.hospitalId <= 3
        }));
      },
      error: (err) => {
        console.warn('Không kết nối được API. Kích hoạt dữ liệu dự phòng bệnh viện ĐKNG...', err);
        this.hospitals = [
          {
            hospitalId: 1,
            name: 'Bệnh viện đa khoa tỉnh Bình Định',
            image: 'images/anhbenhvien/bvdk.jpg',
            address: '106 Nguyễn Huệ, Phường Quy Nhơn, Tỉnh Gia Lai',
            rating: 0,
            reviewCount: 0,
            isVerified: true
          },
          {
            hospitalId: 2,
            name: 'Bệnh viện Mắt Bình Định',
            image: 'images/anhbenhvien/bvmat.jpg',
            address: '78 Trần Hưng Đạo, Quy Nhơn, Gia Lai',
            rating: 0,
            reviewCount: 0,
            isVerified: true
          },
          {
            hospitalId: 3,
            name: 'Trung tâm Y tế Quy Nhơn',
            image: 'images/anhbenhvien/bvquynhon.jpg',
            address: '114 Trần Hưng Đạo, phường Quy Nhơn, tỉnh Gia Lai',
            rating: 0,
            reviewCount: 0,
            isVerified: true
          }
        ];
      }
    });

    this.http.get<Doctor[]>('http://localhost:5213/api/doctors').subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => {
        console.warn('Không kết nối được API. Kích hoạt dữ liệu dự phòng bác sĩ ĐKNG...', err);
        this.doctors = [
          {
            doctorId: 1,
            fullName: 'BS CKII. Ngô Trung Nam',
            avatar: 'anhbs3.jpg',
            experienceYears: 10,
            specialization: { name: 'Nội tim mạch' },
            hospital: {
              hospitalId: 1,
              name: 'Bệnh viện đa khoa tỉnh Bình Định',
              address: '106 Nguyễn Huệ, Phường Quy Nhơn, Tỉnh Gia Lai',
              rating: 0,
              reviewCount: 0,
              isVerified: true
            }
          }
        ];
      }
    });
  }

  getLogoPath(image?: string): string {
    if (!image) return 'assets/images/logo.png';
    return image.startsWith('images/') ? `assets/${image}` : `assets/images/anhbenhvien/${image}`;
  }

  getDoctorAvatarPath(avatar?: string): string {
    return avatar ? `assets/images/anhbacsi/${avatar}` : 'assets/images/doctor.png';
  }

  onImgError(event: any, type: 'hospital' | 'doctor'): void {
    event.target.src = type === 'hospital' ? 'assets/images/logo.png' : 'assets/images/doctor.png';
  }

  get paginatedHospitals(): Hospital[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.hospitals.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    const listLength = this.displayMode === 'hospital' ? this.hospitals.length : this.doctors.length;
    return Math.ceil(listLength / this.itemsPerPage);
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

  openBookingModal(id: number, name: string): void {
    if (!this.isLoggedIn) {
      if (confirm('Vui lòng đăng nhập để đặt lịch khám ngoài giờ!')) {
        this.router.navigate(['/account/login']);
      }
      return;
    }

    if (this.userRole !== 'patient') {
      alert('Vui lòng đăng nhập bằng tài khoản Bệnh nhân để thực hiện đặt lịch!');
      return;
    }

    this.bookingData = { id: id, name: name, date: '', time: '', specialty: '' };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onBookingSubmit(): void {
    const body = new URLSearchParams({
      hospitalId: this.bookingData.id.toString(),
      date: this.bookingData.date,
      time: this.bookingData.time,
      specialty: this.bookingData.specialty
    });

    this.http.post<any>('http://localhost:5213/api/appointments', body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).subscribe({
      next: (data) => {
        if (data.success) {
          alert('Đặt lịch khám ngoài giờ thành công!');
          this.closeModal();
        } else {
          alert('Lỗi: ' + data.message);
        }
      },
      error: () => alert('Có lỗi xảy ra khi thực hiện đặt khám ngoài giờ!')
    });
  }
}