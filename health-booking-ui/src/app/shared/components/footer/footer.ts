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

  dichVu = [
    { name: 'Đặt khám tại cơ sở', link: '/dkcs' },
    { name: 'Đặt khám chuyên khoa', link: '/dkck' },
    { name: 'Gói video với bác sĩ', link: '/gvbs' },
    { name: 'Đặt khám theo bác sĩ', link: '/dkbs' },
    { name: 'Đặt khám ngoài giờ', link: '/dkng' },
    { name: 'Thanh toán viện phí', link: '/ttvp' },
    { name: 'Gói khám sức khỏe', link: '/gksk' }
  ];

  coSo = [
    { name: 'Bệnh viện công', link: '/bvcong' },
    { name: 'Bệnh viện tư', link: '/bvtu' }
  ];

  huongDan = [
    { name: 'Cài đặt ứng dụng', link: '/taiungdung' },
    { name: 'Đặt lịch khám', link: '/dlk' },
    { name: 'Quy trình hoàn phí', link: '/hoanphi' },
    { name: 'Câu hỏi thường gặp', link: '/cauhoi' },
    { name: 'Quy trình đi khám', link: '/dikham' }
  ];

  lienHe = [
    { name: 'Cơ sở y tế', link: '/cosoyte' },
    { name: 'Quảng cáo', link: '/quangcao' },
    { name: 'Tuyển dụng', link: '/tuyendung' }
  ];

  trangChu = [
    { name: 'Giới thiệu', link: '/gioithieu' },
    { name: 'Điều khoản dịch vụ', link: '/dieukhoan' },
    { name: 'Chính sách bảo mật', link: '/chinhsach' },
    { name: 'Quy định sử dụng', link: '/sudung' }
  ];
}