import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/config/api.config';
import { FALLBACK_LOGO, hospitalImagePath } from '../../../core/utils/image.util';

export interface Hospital {
  hospitalId: number;
  name: string;
  address: string;
  image?: string;
  description?: string;
  hotline?: string;
  websiteUrl?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

@Component({
  selector: 'app-dkcs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './dkcs.html',
  styleUrl: './dkcs.css',
})
export class Dkcs implements OnInit {
  hospitals: Hospital[] = [];
  filteredHospitals: Hospital[] = [];
  searchTerm = '';
  loadError = '';

  isLoggedIn = false;
  userRole = '';
  isModalOpen = false;

  bookingData = { hospitalId: 0, hospitalName: '', date: '', time: '', specialty: '' };

  currentPage = 1;
  itemsPerPage = 3;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadHospitals();
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

  loadHospitals(): void {
    this.http.get<Hospital[]>(`${API_BASE_URL}/api/hospitals`).subscribe({
      next: (data) => {
        this.hospitals = data.map(h => ({
          ...h,
          rating: h.rating ?? 0,
          reviewCount: 0,
          isVerified: h.hospitalId <= 3
        }));
        this.loadError = '';
        this.filterHospitals();
        this.cdr.markForCheck();
      },
      error: () => {
        this.hospitals = [];
        this.filteredHospitals = [];
        this.loadError = 'Không tải được danh sách bệnh viện từ database. Vui lòng chạy API backend.';
        this.cdr.markForCheck();
      }
    });
  }

  filterHospitals(): void {
    if (!this.searchTerm.trim()) {
      this.filteredHospitals = [...this.hospitals];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredHospitals = this.hospitals.filter(h =>
        h.name.toLowerCase().includes(searchLower) ||
        h.address.toLowerCase().includes(searchLower)
      );
    }
    this.currentPage = 1;
  }

  getLogoPath(image?: string): string {
    return hospitalImagePath(image);
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = FALLBACK_LOGO;
  }

  get paginatedHospitals(): Hospital[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredHospitals.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredHospitals.length / this.itemsPerPage);
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
      if (confirm('Vui lòng đăng nhập để đặt khám tại cơ sở!')) {
        this.router.navigate(['/login']);
      }
      return;
    }

    if (this.userRole !== 'patient') {
      alert('Vui lòng đăng nhập bằng tài khoản Bệnh nhân để thực hiện đặt lịch!');
      return;
    }

    this.bookingData = { hospitalId: id, hospitalName: name, date: '', time: '', specialty: '' };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onBookingSubmit(): void {
    const body = new URLSearchParams({
      userId: this.getUserId(),
      hospitalId: this.bookingData.hospitalId.toString(),
      date: this.bookingData.date,
      time: this.bookingData.time,
      specialty: this.bookingData.specialty
    });

    this.http.post<any>(`${API_BASE_URL}/api/appointments`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).subscribe({
      next: (data) => {
        if (data.success) {
          alert('Đặt lịch khám tại cơ sở thành công!');
          this.closeModal();
        } else {
          alert('Lỗi: ' + data.message);
        }
      },
      error: () => alert('Có lỗi xảy ra khi thực hiện đặt khám!')
    });
  }
}
