import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

interface Job {
  id: number;
  title: string;
  type: 'full-time' | 'part-time' | 'internship';
}

@Component({
  selector: 'app-td',
  standalone: true,
  imports: [RouterModule, FormsModule, NgClass],
  templateUrl: './td.html',
  styleUrl: './td.css',
})
export class TD implements OnInit {
  title = 'Tuyển dụng';

  // Điều kiện tìm kiếm và bộ lọc
  searchText: string = '';
  selectedType: string = '';

  // Quản lý phân trang
  currentPage: number = 1;
  itemsPerPage: number = 8;

  // Khai báo tập dữ liệu mẫu được bóc tách từ danh sách thẻ <tr> tĩnh ban đầu của bạn
  jobs: Job[] = [
    { id: 1, title: 'Phát Triển Kinh Doanh (B2B)', type: 'full-time' },
    { id: 2, title: 'Chuyên Viên Hành Chính Nhân Sự', type: 'full-time' },
    { id: 3, title: 'Kế Toán Viên Kiêm Chăm Sóc Khách Hàng', type: 'full-time' },
    { id: 4, title: 'Thực Tập Sinh Content Marketing', type: 'part-time' },
    { id: 5, title: 'Giám Đốc Phát Triển Kinh Doanh - Dịch Vụ', type: 'full-time' },
    { id: 6, title: 'Business Analyst', type: 'full-time' },
    { id: 7, title: 'Frontend ReactJS Developer', type: 'full-time' },
    { id: 8, title: 'Backend NodeJS Developer', type: 'full-time' },
    { id: 9, title: 'Mobile App Developer (iOS/Android)', type: 'full-time' },
    { id: 10, title: 'Digital Marketing Specialist', type: 'part-time' },
    { id: 11, title: 'Data Analyst Intern', type: 'internship' },
    { id: 12, title: 'UI/UX Designer', type: 'full-time' },
    { id: 13, title: 'Product Manager', type: 'full-time' },
    { id: 14, title: 'QA Engineer', type: 'full-time' },
    { id: 15, title: 'Senior Technical Writer', type: 'part-time' },
    { id: 16, title: 'DevOps Engineer', type: 'full-time' },
    { id: 17, title: 'Graphics Designer Intern', type: 'internship' }
  ];

  constructor() { }

  ngOnInit(): void { }

  // Hàm hiển thị nhãn ngôn ngữ tiếng Việt thân thiện thay thế cho class badge
  getJobTypeLabel(type: string): string {
    switch (type) {
      case 'full-time': return 'Full time';
      case 'part-time': return 'Part time';
      case 'internship': return 'Thực tập sinh';
      default: return type;
    }
  }

  // Lọc danh sách công việc dựa trên ô tìm kiếm dữ liệu và hộp chọn Option
  get filteredJobs(): Job[] {
    return this.jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(this.searchText.toLowerCase().trim());
      const matchesType = this.selectedType === '' || job.type === this.selectedType;
      return matchesSearch && matchesType;
    });
  }

  // Lấy danh sách công việc hiển thị trên trang hiện tại
  get pagedJobs(): Job[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredJobs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Tính toán tổng số trang dựa trên danh sách dữ liệu sau khi lọc
  get totalPages(): number {
    return Math.ceil(this.filteredJobs.length / this.itemsPerPage);
  }

  // Tạo mảng tuần tự số trang [1, 2, 3...] để render vòng lặp nút bấm ở HTML
  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Chuyển trang
  goToPage(page: number): void {
    this.currentPage = page;
  }

  // Khi thay đổi bộ lọc, reset số trang về lại trang 1
  onFilterChange(): void {
    this.currentPage = 1;
  }

  // Nhấn Enter ở thanh tìm kiếm
  onSearch(): void {
    this.currentPage = 1;
  }
}