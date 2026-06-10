import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/config/api.config';
import { FALLBACK_LOGO, specialtyIconPath } from '../../../core/utils/image.util';

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
  loadError = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadSpecializations();
  }

  loadSpecializations(): void {
    // this.http.get<Specialization[]>(`${API_BASE_URL}/api/specializations`).subscribe({
    this.http.get<Specialization[]>(`https://localhost:7291/api/specializations`).subscribe({
      next: (data) => {
        this.specializations = data;
        this.loadError = '';
        this.cdr.markForCheck();
      },
      error: () => {
        this.specializations = [];
        this.loadError = 'Không tải được danh sách chuyên khoa. Vui lòng chạy API backend (port 5213).';
        this.cdr.markForCheck();
      }
    });
  }

  getSearchUrl(name: string): string {
    const searchKeyword = name.replace(/ - /g, ' ');
    return `https://medpro.vn/tim-kiem?kw=${encodeURIComponent(searchKeyword)}&tab=subject&page=1`;
  }

  getIconPath(name: string): string {
    return specialtyIconPath(name);
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = FALLBACK_LOGO;
  }
}