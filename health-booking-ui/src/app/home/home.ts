import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FALLBACK_LOGO, specialtyIconPath } from '../core/utils/image.util';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('HealthBookingUi'); 
  }

  specialties = [
    'Bác sĩ gia đình',
    'Da liễu',
    'Mắt',
    'Ngoại cơ xương khớp',
    'Nội cơ xương khớp',
    'Nội hô hấp',
    'Nội thần kinh',
    'Nội tiết niệu',
    'Nội tiết',
    'Nội tiêu hoá',
    'Nội tim mạch',
    'Nội tổng quát',
    'Sản - Phụ khoa',
    'Tai mũi họng',
    'Tiêu hoá gan mật'
  ];

  getIconPath(name: string): string {
    return specialtyIconPath(name);
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = FALLBACK_LOGO;
  }
}
