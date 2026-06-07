import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-qthp',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './qthp.html',
  styleUrl: './qthp.css',
})
export class QTHP implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // Đổi tiêu đề tab trình duyệt thay cho ViewData["Title"]
    this.titleService.setTitle('Quy trình hoàn phí');
  }}
