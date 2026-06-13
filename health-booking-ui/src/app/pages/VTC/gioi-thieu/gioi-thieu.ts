import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gioi-thieu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gioi-thieu.html',
  styleUrls: ['./gioi-thieu.css']
})
export class GioiThieuComponent {

  features = [
    "Đăng ký và chọn ngày, giờ khám bệnh",
    "Thanh toán chi phí qua nhiều hình thức",
    "Quản lý lịch sử khám bệnh và hồ sơ sức khỏe",
    "Tìm kiếm thông tin bệnh viện, phòng khám, bác sĩ"
  ];

  hospitals = [
    { name: "Bệnh viện Bình Định", logo: "assets/images/anhbenhvien/bvbinhdinh.jpg" },
    { name: "Bệnh viện đa khoa tỉnh Bình Định", logo: "assets/images/anhbenhvien/bvdk.jpg" },
    { name: "Bệnh viện Hòa Bình", logo: "assets/images/anhbenhvien/bvhoabinh.jpg" },
    { name: "Bệnh viện Mắt Bình Định", logo: "assets/images/anhbenhvien/bvmat.jpg" },
    { name: "Bệnh viện Quy Hòa", logo: "assets/images/anhbenhvien/bvquyhoa.jpg" },
    { name: "Bệnh viện TP Quy Nhơn", logo: "assets/images/anhbenhvien/bvquynhon.jpg" },
    { name: "Trung tâm Y tế Tuy Phước", logo: "assets/images/anhbenhvien/bvtuyphuoc.jpg" },
    { name: "Bệnh viện Đa khoa Thu Phúc", logo: "assets/images/anhbenhvien/dktp.jpg" },
    { name: "Bệnh viện Quân Y 13", logo: "assets/images/anhbenhvien/quany13.jpg" },
    { name: "Bệnh viện Y học cổ truyền", logo: "assets/images/anhbenhvien/yhoccotruyen.jpg" },
    { name: "Trung tâm Y tế TP Quy Nhơn", logo: "assets/images/anhbenhvien/ytqn.jpg" }
  ];
}