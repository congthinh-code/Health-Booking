import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cdud',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cdud.html',
  styleUrl: './cdud.css',
})
export class CDUD {
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Hướng dẫn cài đặt ứng dụng');
  }
}
