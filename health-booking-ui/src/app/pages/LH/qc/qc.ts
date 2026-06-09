import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {LhService} from '../../../core/services/lh-service/lh-service';

@Component({
  selector: 'app-qc',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './qc.html',
  styleUrl: './qc.css',
})
export class QC implements OnInit {
  // Đổi tên thành promoHospitals cho khớp với lệnh @for trong HTML của bạn
  promoHospitals: any[] = [];

  // Khai báo formData và hàm onSubmit cho Form liên hệ của bạn
  formData: any = {
    name: '',
    company: '',
    phone: '',
    field: '',
    message: ''
  };
  
  constructor(private lhService: LhService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Gọi hàm getQC() từ đúng lhService
    this.lhService.getQC().subscribe({
      next: (data) => {
        this.promoHospitals = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Lỗi lấy danh sách QC:', err)
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    alert(`Cảm ơn ${this.formData.name} từ công ty ${this.formData.company} đã liên hệ quảng cáo!`);
  }
}
