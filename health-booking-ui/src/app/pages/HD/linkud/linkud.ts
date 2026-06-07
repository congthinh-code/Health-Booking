import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-linkud',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './linkud.html',
  styleUrl: './linkud.css',
})
export class Linkud implements OnInit {

  // Lấy năm hiện tại tự động ở Frontend thay cho @DateTime.Now.Year của C#
  currentYear: number = new Date().getFullYear();

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Tải ứng dụng HealthMeet');
  }
}
