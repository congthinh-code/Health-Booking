import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HospitalService } from '../../../core/services/hospital-service/hospital-service';

@Component({
  selector: 'app-qc',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './qc.html',
  styleUrl: './qc.css',
})
export class QC implements OnInit {
  allHospitals: any[] = [];   // Khai báo mảng gốc chứa toàn bộ data từ API
  promoHospitals: any[] = []; // Khai báo mảng chứa 5 bệnh viện cắt ra để hiển thị

  formData = {
    name: '',
    company: '',
    phone: '',
    field: '',
    message: ''
  };

  constructor(private hospitalService: HospitalService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void { 
    // Gọi API để lấy danh sách bệnh viện
    this.hospitalService.getHospitals().subscribe({
        next: (data: any) => {
          if (data && data.length > 0) {
            // 1. Map lại ảnh chuẩn xác bằng hàm check tên giống như bên CSYT
            const mappedData = data.map((item: any) => {
              return {
                ...item,
                image: this.getHospitalImageByTagName(item.name)
              };
            });

            // 2. CHỈ CẮT LẤY ĐÚNG 5 BỆNH VIỆN ĐẦU TIÊN
            this.promoHospitals = mappedData.slice(0, 5);
            
            // 3. Ép Angular quét và cập nhật lại giao diện ngay lập tức
            this.cdr.detectChanges();
          }
        }
      });
    }

    onSubmit(event: Event): void {
    event.preventDefault(); // Ngăn trang bị reload lại khi bấm nút
    
    console.log('Dữ liệu khách hàng đăng ký quảng cáo:', this.formData);
    
    // Test thử xem nhận data chưa
    alert(`Chúc mừng ${this.formData.name} đã gửi yêu cầu đăng ký thành công!`);
    
    // Bạn có thể viết gọi API lưu form vào DB ở đây nếu cần thiết
  }

    // Giữ lại hàm map ảnh chuẩn
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
}
