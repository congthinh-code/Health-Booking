import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface Specialization {
  specializationId?: number;
  name: string;
}

@Component({
  selector: 'app-dkck',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dkck.html',
  styleUrl: './dkck.css',
})
export class Dkck implements OnInit {
  specializations: Specialization[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSpecializations();
  }

  loadSpecializations(): void {
    this.http.get<Specialization[]>('http://localhost:5213/api/specializations').subscribe({
      next: (data) => {
        this.specializations = data;
      },
      error: (err) => {
        console.warn('Không kết nối được API. Kích hoạt dữ liệu dự phòng chuyên khoa...', err);
        this.specializations = [
          { name: 'Bác sĩ gia đình' },
          { name: 'Tiêu hoá gan mật' },
          { name: 'Nội tổng quát' },
          { name: 'Nội tiết' },
          { name: 'Da liễu' },
          { name: 'Nội tim mạch' },
          { name: 'Nội thần kinh' },
          { name: 'Nội cơ xương khớp' },
          { name: 'Tai mũi họng' },
          { name: 'Mắt' },
          { name: 'Nội tiêu hoá' },
          { name: 'Nội hô hấp' },
          { name: 'Nội tiết niệu' },
          { name: 'Ngoại cơ xương khớp' },
          { name: 'Sản - Phụ khoa' }
        ];
      }
    });
  }

  getSearchUrl(name: string): string {
    const searchKeyword = name.replace(/ - /g, ' ');
    return `https://medpro.vn/tim-kiem?kw=${encodeURIComponent(searchKeyword)}&tab=subject&page=1`;
  }

  getIconPath(name: string): string {
    let filename = name.trim();
    if (filename === 'Sản - Phụ khoa') {
      filename = 'Sản - phụ khoa';
    }
    return `assets/images/iconchuyenkhoa/${filename}.png`;
  }

  onImgError(event: any): void {
    event.target.src = 'assets/images/logo.png';
  }
}