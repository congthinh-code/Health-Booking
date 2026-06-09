import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/config/api.config';
import { doctorAvatarPath, FALLBACK_DOCTOR } from '../../../core/utils/image.util';

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
  loadError = '';

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
      const userId = sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
      const role = (sessionStorage.getItem('role') || localStorage.getItem('role') || '').toLowerCase();
      this.isLoggedIn = !!userId;
      this.userRole = role;
    }
  }

  getUserId(): string {
    return sessionStorage.getItem('user_id') || localStorage.getItem('user_id') || '';
  }

  loadDoctors(): void {
    this.http.get<Doctor[]>(`${API_BASE_URL}/api/doctors`).subscribe({
      next: (data) => {
        this.doctors = data;
        this.loadError = '';
        this.setSelectedDoctorFromQuery();
      },
      error: () => {
        this.doctors = [];
        this.loadError = 'Không tải được danh sách bác sĩ từ database. Vui lòng chạy API backend.';
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
    return doctorAvatarPath(avatar);
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = FALLBACK_DOCTOR;
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
        this.router.navigate(['/login']);
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
      userId: this.getUserId(),
      doctorId: this.bookingData.doctorId.toString(),
      date: this.bookingData.date,
      time: this.bookingData.time
    });

    this.http.post<any>(`${API_BASE_URL}/api/appointments`, body.toString(), {
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