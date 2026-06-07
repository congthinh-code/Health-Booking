import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chtg',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chtg.html',
  styleUrl: './chtg.css',
})
export class CHTG implements OnInit {
  // Danh mục câu hỏi
  categories = [
    { key: 'van-de-chung', value: 'Vấn đề chung' },
    { key: 'van-de-tai-khoan', value: 'Vấn đề tài khoản' },
    { key: 'van-de-thanh-toan', value: 'Vấn đề về thanh toán' },
    { key: 'van-de-fundiin', value: 'Vấn đề trả sau qua Fundiin' }
  ];

  // Danh mục đang được chọn mặc định
  currentCategory: string = 'van-de-chung';

  // Bộ dữ liệu câu hỏi dạng Key-Value (Dùng kiểu Record tương đương Dictionary)
  faqData: Record<string, string[]> = {
    'van-de-chung': [
      'Lợi ích khi sử dụng ứng dụng đăng ký khám bệnh trực tuyến này là gì?',
      'Làm sao để sử dụng được ứng dụng đăng ký khám bệnh trực tuyến?',
      'Đăng ký khám bệnh online có mất phí không?',
      'Ứng dụng có hỗ trợ đăng ký khám 24/7 không?'
    ],
    'van-de-tai-khoan': [
      'Mã số bệnh nhân là gì? Làm sao tôi có thể biết được mã số bệnh nhân của mình?',
      'Tôi quên mã số bệnh nhân của mình thì phải làm sao?',
      'Làm sao tôi biết bên mình đã có mã số bệnh nhân chưa?',
      'Tôi có thể chọn tùy ý một hồ sơ bệnh nhân của người khác để đăng ký khám bệnh cho mình không?'
    ],
    'van-de-thanh-toan': [
      'Điều kiện để được hoàn tiền là gì?',
      'Hoàn tiền như thế nào? Bao lâu thì tôi nhận lại được tiền hoàn?',
      'Thông tin thanh toán của tôi có bị lộ không?',
      'Tôi nhập tài khoản thẻ nhưng bấm xác thực hoài không được?',
      'Phí tiện ích là gì?',
      'Cách tính phí tiện ích'
    ],
    'van-de-fundiin': [
      'Quy trình thu hồi nợ diễn ra như thế nào?',
      'Hạn mức tối đa khách hàng có thể sử dụng?',
      'Nếu thanh toán trễ hơn kỳ hạn, tôi sẽ phải trả mức phí bao nhiêu?',
      'Lý do khách hàng bị từ chối là gì?',
      'Nếu không còn nhu cầu sử dụng, tôi có thể hủy dịch vụ không?'
    ]
  };

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Câu hỏi thường gặp');
  }

  // Hàm xử lý sự kiện khi click chọn danh mục bên Sidebar
  selectCategory(key: string): void {
    this.currentCategory = key;
  }
}
