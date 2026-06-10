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
}

@Component({
  selector: 'app-ttvp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './ttvp.html',
  styleUrl: './ttvp.css',
})
export class Ttvp implements OnInit {
  hospitals: Hospital[] = [];
  filteredHospitals: Hospital[] = [];
  searchTerm = '';
  loadError = '';

  isLoggedIn = false;
  isModalOpen = false;

  paymentData: {
    hospitalId: number;
    hospitalName: string;
    patientName: string;
    patientCode: string;
    amount: number | null;
    method: string;
  } = {
    hospitalId: 0,
    hospitalName: '',
    patientName: '',
    patientCode: '',
    amount: null,
    method: ''
  };

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
      this.isLoggedIn = !!userId;
    }
  }

  getUserId(): string {
    return sessionStorage.getItem('user_id') || localStorage.getItem('user_id') || '';
  }

  loadHospitals(): void {
    this.http.get<Hospital[]>(`${API_BASE_URL}/api/hospitals`).subscribe({
      next: (data) => {
        this.hospitals = data;
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
  }

  getImgPath(image?: string): string {
    return hospitalImagePath(image);
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = FALLBACK_LOGO;
  }

  openPaymentModal(id: number, name: string): void {
    if (!this.isLoggedIn) {
      if (confirm('Vui lòng đăng nhập để tiến hành thanh toán viện phí trực tuyến!')) {
        this.router.navigate(['/login']);
      }
      return;
    }

    this.paymentData = {
      hospitalId: id,
      hospitalName: name,
      patientName: '',
      patientCode: '',
      amount: null,
      method: ''
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onPaymentSubmit(): void {
    const body = new URLSearchParams({
      userId: this.getUserId(),
      hospitalId: this.paymentData.hospitalId.toString(),
      patientName: this.paymentData.patientName,
      patientCode: this.paymentData.patientCode,
      amount: this.paymentData.amount ? this.paymentData.amount.toString() : '0',
      method: this.paymentData.method
    });

    this.http.post<any>(`${API_BASE_URL}/api/appointments`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).subscribe({
      next: (data) => {
        if (data.success) {
          alert('Giao dịch thành công! ' + data.message);
          this.closeModal();
        } else {
          alert('Thanh toán thất bại: ' + data.message);
        }
      },
      error: (err) => {
        console.error('Lỗi khi thanh toán viện phí:', err);
        alert('Có lỗi hệ thống xảy ra khi thực hiện thanh toán!');
      }
    });
  }
}