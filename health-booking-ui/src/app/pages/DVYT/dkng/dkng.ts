import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/config/api.config';
import { doctorAvatarPath, FALLBACK_DOCTOR, FALLBACK_LOGO, hospitalImagePath } from '../../../core/utils/image.util';

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
  loadError = '';

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
      const userId = sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
      const role = (sessionStorage.getItem('role') || localStorage.getItem('role') || '').toLowerCase();
      this.isLoggedIn = !!userId;
      this.userRole = role;
    }
  }

  getUserId(): string {
    return sessionStorage.getItem('user_id') || localStorage.getItem('user_id') || '';
  }

  loadData(): void {
    this.http.get<Hospital[]>(`${API_BASE_URL}/api/hospitals`).subscribe({
      next: (data) => {
        this.hospitals = data.map(h => ({
          ...h,
          rating: h.rating ?? 0,
          reviewCount: 0,
          isVerified: h.hospitalId <= 3
        }));
        this.loadError = '';
      },
      error: () => {
        this.hospitals = [];
        this.loadError = 'Không tải được dữ liệu từ database. Vui lòng chạy API backend.';
      }
    });

    this.http.get<Doctor[]>(`${API_BASE_URL}/api/doctors`).subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: () => {
        this.doctors = [];
      }
    });
  }

  getLogoPath(image?: string): string {
    return hospitalImagePath(image);
  }

  getDoctorAvatarPath(avatar?: string): string {
    return doctorAvatarPath(avatar);
  }

  onImgError(event: Event, type: 'hospital' | 'doctor'): void {
    (event.target as HTMLImageElement).src = type === 'hospital' ? FALLBACK_LOGO : FALLBACK_DOCTOR;
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
        this.router.navigate(['/login']);
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
      userId: this.getUserId(),
      hospitalId: this.bookingData.id.toString(),
      date: this.bookingData.date,
      time: this.bookingData.time,
      specialty: this.bookingData.specialty
    });

    this.http.post<any>(`${API_BASE_URL}/api/appointments`, body.toString(), {
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