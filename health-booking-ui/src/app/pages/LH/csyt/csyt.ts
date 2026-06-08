import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HospitalService } from '../../../core/services/hospital-service/hospital-service';

@Component({
  selector: 'app-csyt',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './csyt.html',
  styleUrl: './csyt.css',
})
export class CSYT implements OnInit {
  allHospitals: any[] = [];         // Lưu toàn bộ danh sách bốc từ DB về
  displayedHospitals: any[] = [];   // Danh sách thực tế hiển thị trên trang hiện tại

  // Cấu hình phân trang chuẩn chỉnh
  currentPage: number = 1;
  pageSize: number = 4;             // Đang hiện 4 card trên 1 hàng giống như ảnh image_11d44d.jpg của bạn
  totalPages: number = 1;
  pages: number[] = [];            // Mảng số trang để hiển thị nút chuyển trang

  constructor(
    private hospitalService: HospitalService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.hospitalService.getHospitals().subscribe({
      next: (data: any) => {
        if (data && data.length > 0) {
          // Map ảnh chuẩn xác dựa vào TÊN BỆNH VIỆN chứ không dùng ID nữa
          this.allHospitals = data.map((item: any) => {
            return {
              ...item,
              image: this.getHospitalImageByTagName(item.name)
            };
          });

          // Tính toán tổng số trang dựa trên toàn bộ dữ liệu trả về từ DB
          this.totalPages = Math.ceil(this.allHospitals.length / this.pageSize);
          
          // TẠO MẢNG SỐ TRANG NGAY TẠI ĐÂY
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1); // Kết quả sẽ ra [1, 2, 3]

          // Cắt mảng để hiển thị trang đầu tiên (Trang 1)
          this.updatePageData();
        }
      },
      error: (err: any) => {
        console.error('Lỗi API:', err);
      }
    });
  }

  // Hàm cắt mảng dữ liệu khi chuyển trang
  updatePageData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedHospitals = this.allHospitals.slice(startIndex, endIndex);
    this.cdr.detectChanges(); // Ép Angular vẽ lại giao diện
  }

  // Hàm xử lý so khớp TÊN FILE ẢNH dựa vào TÊN BỆNH VIỆN từ DB trả về
  getHospitalImageByTagName(hospitalName: string): string {
    if (!hospitalName) return 'assets/images/anhbenhvien/bvdk.jpg';
    
    const nameLower = hospitalName.toLowerCase();

    // So khớp từ khóa xuất hiện trong tên để gán đúng file ảnh trong thư mục của bạn
    if (nameLower.includes('thu phúc')) {
      return 'assets/images/anhbenhvien/dktp.jpg';
    }
    if (nameLower.includes('bình định') && nameLower.includes('tỉnh')) {
      return 'assets/images/anhbenhvien/bvdk.jpg';
    }
    if (nameLower.includes('hòa bình') || nameLower.includes('đa khoa')) {
      return 'assets/images/anhbenhvien/bvhoabinh.jpg';
    }
    if (nameLower.includes('mắt')) {
      return 'assets/images/anhbenhvien/bvmat.jpg';
    }
    if (nameLower.includes('quy nhơn') && (nameLower.includes('trung tâm') || nameLower.includes('thành phố'))) {
      return 'assets/images/anhbenhvien/ytqn.jpg';
    }
    if (nameLower.includes('y học cổ truyền')) {
      return 'assets/images/anhbenhvien/yhoccotruyen.jpg';
    }
    if (nameLower.includes('quy hòa') || nameLower.includes('da liễu')) {
      return 'assets/images/anhbenhvien/bvquyhoa.jpg';
    }
    if (nameLower.includes('tuy phước')) {
      return 'assets/images/anhbenhvien/bvtuyphuoc.jpg';
    }
    if (nameLower.includes('quân y 13')) {
      return 'assets/images/anhbenhvien/quany13.jpg';
    }

    // Ảnh dự phòng nếu không khớp tên nào ở trên
    return 'assets/images/logo.jpg'; 
  }

  // HÀM CHUYỂN TRANG TRỰC TIẾP
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePageData();
    }
  }

  // Hàm nút Trang trước
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePageData();
    }
  }

  // Hàm nút Trang sau
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePageData();
    }
  }
}