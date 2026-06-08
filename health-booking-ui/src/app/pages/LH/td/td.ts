import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import {LhService} from '../../../core/services/lh-service/lh-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-td',
  standalone: true,
  imports: [RouterModule, FormsModule, NgClass],
  templateUrl: './td.html',
  styleUrl: './td.css',
})
export class TD implements OnInit {
  allJobs: any[] = [];       // Lưu toàn bộ danh sách gốc từ API
  pagedJobs: any[] = [];     // Danh sách đã lọc + phân trang hiển thị lên HTML
  
  // Các biến binding [(ngModel)] từ HTML của bạn
  searchText: string = '';
  selectedType: string = '';
  
  // Phân trang nội bộ cho giao diện của bạn
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 1;
  totalPagesArray: number[] = [];

  constructor(
    private lhService: LhService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.lhService.getTD().subscribe({
      next: (data) => {
        this.allJobs = data;
        this.applyFilterAndPagination();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Lỗi lấy danh sách tuyển dụng:', err)
    });
  }

  // Hàm xử lý tìm kiếm và bộ lọc Type (Full-time/Part-time) của bạn
  applyFilterAndPagination(): void {
    let filtered = this.allJobs;

    // Lọc theo từ khóa tìm kiếm
    if (this.searchText.trim()) {
      filtered = filtered.filter(j => j.title.toLowerCase().includes(this.searchText.toLowerCase()));
    }

    // Lọc theo loại công việc
    if (this.selectedType) {
      filtered = filtered.filter(j => {
        if (!j.type) return false;
        
        // Biến đổi "Full Time" hoặc "full-time" đều thành "fulltime" để so sánh
        const cleanJobType = j.type.toLowerCase().replace(/[\s-]/g, '');
        const cleanSelectedType = this.selectedType.toLowerCase().replace(/[\s-]/g, '');
        
        return cleanJobType === cleanSelectedType;
      });
    }

    // Tính toán phân trang dựa trên số lượng sau khi lọc
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }

    // Cắt mảng để gán vào pagedJobs hiển thị lên HTML
    this.pagedJobs = filtered.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    this.cdr.detectChanges();
  }

  // Các hàm tương tác nút bấm trên HTML của bạn
  onSearch(): void {
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.applyFilterAndPagination();
  }

  // Hàm hiển thị nhãn đẹp mắt cho Job Type
  getJobTypeLabel(type: string): string {
    if (type.toLowerCase() === 'full time') return 'Full Time';
    if (type.toLowerCase() === 'part time') return 'Part Time';
    return 'Internship';
  }

  viewDetail(jobId: number) {
    this.router.navigate(['/job-detail', jobId]);
  }
}