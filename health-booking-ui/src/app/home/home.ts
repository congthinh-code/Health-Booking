import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  // DỮ LIỆU SET CỨNG Ở ĐÂY NÈ BẠN
  specialties = [
    { label: 'Bác sĩ gia đình', fileName: 'Bác sĩ gia đình' },
    { label: 'Da liễu', fileName: 'Da liễu' },
    { label: 'Mắt', fileName: 'Mắt' },
    { label: 'Ngoại cơ xương khớp', fileName: 'Ngoại cơ xương khớp' },
    { label: 'Nội cơ xương khớp', fileName: 'Nội cơ xương khớp' },
    { label: 'Nội hô hấp', fileName: 'Nội hô hấp' },
    { label: 'Nội thần kinh', fileName: 'Nội thần kinh' },
    { label: 'Nội tiết niệu', fileName: 'Nội tiết niệu' },
    { label: 'Nội tiết', fileName: 'Nội tiết' },
    { label: 'Nội tiêu hóa', fileName: 'Nội tiêu hoá' }, 
    { label: 'Nội tim mạch', fileName: 'Nội tim mạch' },
    { label: 'Nội tổng quát', fileName: 'Nội tổng quát' },
    { label: 'Sản - Phụ khoa', fileName: 'Sản - phụ khoa' },
    { label: 'Tai mũi họng', fileName: 'Tai mũi họng' },
    { label: 'Tiêu hóa gan mật', fileName: 'Tiêu hoá gan mật' }
  ];
}
