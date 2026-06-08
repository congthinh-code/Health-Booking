import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {LhService} from '../../../core/services/lh-service/lh-service';

@Component({
  selector: 'app-csyt',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './csyt.html',
  styleUrl: './csyt.css',
})
export class CSYT implements OnInit {
  hospitals: any[] = [];         // Lưu toàn bộ danh sách bốc từ DB về

  // Cấu hình phân trang chuẩn chỉnh
  currentPage: number = 1;
  pageSize: number = 4;             // Đang hiện 4 card trên 1 hàng giống như ảnh image_11d44d.jpg của bạn
  totalPages: number = 1;
  pages: number[] = [];            // Mảng số trang để hiển thị nút chuyển trang

  constructor(private lhService: LhService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadHospitals(this.currentPage);
  }

  loadHospitals(page: number): void {
    this.lhService.getCSYT(page, this.pageSize).subscribe({
      next: (res) => {
        this.hospitals = res.data || res.data;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages || res.totalPages;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Lỗi lấy data bệnh viện:', err)
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadHospitals(page);
    }
  }
}