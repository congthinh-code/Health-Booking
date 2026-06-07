import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qtdk',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './qtdk.html',
  styleUrl: './qtdk.css',
})
export class QTDK implements OnInit {
  // Biến quản lý trạng thái đóng/mở của Modal (Mặc định là đóng)
  isModalOpen: boolean = false;

  // Danh sách bệnh viện
  hospitals: string[] = [
    'Bệnh viện Đa khoa tỉnh Bình Định',
    'Bệnh viện Mắt Bình Định',
    'Bệnh viện Đa khoa TP. Quy Nhơn',
    'Bệnh viện Y học cổ truyền & PHCN Bình Định',
    'Bệnh viện Phong - Da liễu TW Quy Hòa',
    'Bệnh viện Đa khoa Hòa Bình'
  ];

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Quy trình đi khám');
  }

  // Hàm mở Modal
  openModal(): void {
    this.isModalOpen = true;
  }

  // Hàm đóng Modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Hàm đóng Modal khi click ra vùng xám bên ngoài
  onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) {
      this.closeModal();
    }
  }
}
