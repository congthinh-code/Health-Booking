import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Hospital {
  name: string;
  image: string;
  address: string;
  rating: number;
}

@Component({
  selector: 'app-qc',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './qc.html',
  styleUrl: './qc.css',
})
export class QC implements OnInit {
  title = 'Hợp tác quảng cáo cùng HealthBooking';

  // Object lưu trữ thông tin form đăng ký quảng cáo
  formData = {
    name: '',
    company: '',
    phone: '',
    field: '',
    message: ''
  };

  // Dữ liệu Mock tạm thời hiển thị lên lưới đối tác giống trang CSYT
  hospitals: Hospital[] = [
    {
      name: 'Bệnh viện Đa khoa Tỉnh Bình Định',
      image: 'assets/images/hospital1.jpg',
      address: 'Nguyễn Huệ, Trần Phú, Quy Nhơn, Bình Định',
      rating: 4.8
    },
    {
      name: 'Phòng khám Đa khoa Quốc tế',
      image: 'assets/images/hospital2.jpg',
      address: 'Thành phố Quy Nhơn, Bình Định',
      rating: 4.7
    }
  ];

  constructor() { }

  ngOnInit(): void { }

  // Xử lý gửi biểu mẫu thay thế đoạn code tag script cũ
  onSubmit(event: Event) {
    event.preventDefault();

    // Biểu thức chính quy kiểm tra số điện thoại (10-11 chữ số)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(this.formData.phone)) {
      alert('Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số)');
      return;
    }

    // Hiển thị thông báo thành công
    alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.');
    
    // Reset form về trạng thái trống
    this.formData = {
      name: '',
      company: '',
      phone: '',
      field: '',
      message: ''
    };
  }

  /**
   * Mẹo mở rộng: Đoạn script cũ của bạn có hàm lắng nghe click vào các nút "Chọn gói" để điền sẵn tin nhắn.
   * Nếu ở các component khác bạn cần tính năng đó, chỉ việc gọi hàm này:
   * (click)="selectPackage('Tên gói')"
   */
  selectPackage(packageName: string) {
    this.formData.message = `Tôi muốn đăng ký gói: ${packageName}`;
    const element = document.getElementById('registrationForm');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
