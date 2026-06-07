import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Hospital {
  name: string;
  image: string;
  address: string;
  rating: number;
}

@Component({
  selector: 'app-csyt',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './csyt.html',
  styleUrl: './csyt.css',
})
export class CSYT implements OnInit {
  title = 'HealthBooking Partner+ Cùng HealthBooking Nâng Tầm Cơ Sở Y Tế Của Bạn';
  currentPage = 1;

  // Dữ liệu Mock tạm thời hiển thị lên danh sách giống model MVC cũ
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

  ngOnInit(): void {
    // Logic gọi API lấy danh sách thật nếu cần sẽ cấu hình ở đây sau
  }

  // Các hàm điều hướng phân trang giả lập
  goToPage(page: number) {
    this.currentPage = page;
  }
  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
  nextPage() {
    if (this.currentPage < 3) this.currentPage++;
  }
}
