import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer {

  // Hệ thống Dịch vụ Y tế (Khớp với cụm pages/DVYT/...)
  dichVu = [
    { name: 'Đặt khám tại cơ sở', link: '/pages/DVYT/dkcs' },
    { name: 'Đặt khám chuyên khoa', link: '/pages/DVYT/dkck' },
    { name: 'Đặt khám theo bác sĩ', link: '/pages/DVYT/dkbs' },
    { name: 'Đặt khám ngoài giờ', link: '/pages/DVYT/dkng' },
    { name: 'Thanh toán viện phí', link: '/pages/DVYT/ttvp' } 
  ];

  // Cơ sở y tế
  coSo = [
    { name: 'Bệnh viện công', link: '/pages/bvcong' },
    { name: 'Bệnh viện tư', link: '/pages/bvtu' }
  ];

  // Hướng dẫn người dùng
  huongDan = [
    { name: 'Cài đặt ứng dụng', link: '/pages/cdud' },
    { name: 'Quy trình hoàn phí', link: '/pages/qthp' },
    { name: 'Câu hỏi thường gặp', link: '/pages/chtg' },
    { name: 'Quy trình đi khám', link: '/pages/qtdk' }
  ];

  // Liên hệ hợp tác (Khớp với cụm trang liên hệ /pages/LH/...)
  lienHe = [
    { name: 'Cơ sở y tế', link: '/pages/csyt' },
    { name: 'Quảng cáo', link: '/pages/qc' },
    { name: 'Tuyển dụng', link: '/pages/LH/td' }
  ];

  // Về Trang chủ & Các trang thông tin chung

  trangChu = [
    { name: 'Giới thiệu', link: '/pages/VTC/gioi-thieu' }, 
    { name: 'Điều khoản dịch vụ', link: '/pages/VTC/dieu-khoan' },
    { name: 'Chính sách bảo mật', link: '/pages/VTC/bao-mat' },
    { name: 'Quy định sử dụng', link: '/pages/VTC/quy-dinh' }
  ];
}