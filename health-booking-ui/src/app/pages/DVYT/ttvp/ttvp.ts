import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadHospitals();
  }

  checkLoginStatus(): void {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('UserId') || sessionStorage.getItem('UserId');
      this.isLoggedIn = !!userId;
    }
  }

  loadHospitals(): void {
    this.http.get<Hospital[]>('http://localhost:5213/api/hospitals').subscribe({
      next: (data) => {
        this.hospitals = data;
        this.filterHospitals();
      },
      error: (err) => {
        console.warn('Không kết nối được API. Kích hoạt dữ liệu dự phòng bệnh viện TTVP...', err);
        this.hospitals = [
          {
            hospitalId: 1,
            name: 'Bệnh viện đa khoa tỉnh Bình Định',
            image: 'images/anhbenhvien/bvdk.jpg',
            address: '106 Nguyễn Huệ, Phường Quy Nhơn, Tỉnh Gia Lai',
          },
          {
            hospitalId: 2,
            name: 'Bệnh viện Mắt Bình Định',
            image: 'images/anhbenhvien/bvmat.jpg',
            address: '78 Trần Hưng Đạo, Quy Nhơn, Gia Lai',
          },
          {
            hospitalId: 3,
            name: 'Trung tâm Y tế Quy Nhơn',
            image: 'images/anhbenhvien/bvquynhon.jpg',
            address: '114 Trần Hưng Đạo, phường Quy Nhơn, tỉnh Gia Lai',
          },
          {
            hospitalId: 4,
            name: 'Bệnh viện Y học cổ truyền & PHCN Bình Định',
            image: 'images/anhbenhvien/yhoccotruyen.jpg',
            address: 'Tổ 05, KV05, Phường Quy Nhơn Bắc, tỉnh Gia Lai',
          }
        ];
        this.filterHospitals();
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
    if (!image) return 'assets/images/logo.png';
    return image.startsWith('images/') ? `assets/${image}` : `assets/images/anhbenhvien/${image}`;
  }

  onImgError(event: any): void {
    event.target.src = 'assets/images/logo.png';
  }

  openPaymentModal(id: number, name: string): void {
    if (!this.isLoggedIn) {
      if (confirm('Vui lòng đăng nhập để tiến hành thanh toán viện phí trực tuyến!')) {
        this.router.navigate(['/account/login']);
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
      hospitalId: this.paymentData.hospitalId.toString(),
      patientName: this.paymentData.patientName,
      patientCode: this.paymentData.patientCode,
      amount: this.paymentData.amount ? this.paymentData.amount.toString() : '0',
      method: this.paymentData.method
    });

    this.http.post<any>('http://localhost:5213/api/appointments', body.toString(), {
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