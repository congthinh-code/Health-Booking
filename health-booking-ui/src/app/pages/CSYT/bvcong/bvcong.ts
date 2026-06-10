import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bvcong',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './bvcong.html',
  styleUrls: ['./bvcong.css']
})
export class Bvcong implements OnInit {
  hospitals: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getHospitalsFromAPI();
  }

  getHospitalsFromAPI() {
    this.http.get<any[]>('https://localhost:7291/api/csyt/BVCong')
      .subscribe({
        next: (data) => {
          this.hospitals = data;
          this.cdr.detectChanges(); // Ép giao diện hiển thị ngay lập tức, click 1 phát ăn luôn
        },
        error: (err) => {
          console.error('Lỗi gọi API Bệnh viện công:', err);
        }
      });
  }

  getPaginatedHospitals() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.hospitals.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getTotalPages(): number {
    return Math.ceil(this.hospitals.length / this.itemsPerPage);
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.getTotalPages() }, (_, i) => i + 1);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  getStars(rating: number): number[] {
    return Array(rating);
  }
}