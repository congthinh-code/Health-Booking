import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {LhService} from '../../../core/services/lh-service/lh-service';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetail implements OnInit {
  // Đổi tên từ job thành currentJob cho khớp với HTML của bạn
  currentJob: any; 
  
  // Các biến phục vụ cho Modal ứng tuyển trong HTML của bạn
  isOpenModal: boolean = false;
  applyForm: any = {
    name: '',
    email: '',
    phone: '',
    coverLetter: ''
  };

  constructor(
    private route: ActivatedRoute,
    private lhService: LhService
  ) { }

  ngOnInit(): void {
    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    this.lhService.getJobDetail(jobId).subscribe({
      next: (data) => {
        this.currentJob = data;
      },
      error: (err) => console.error('Không tìm thấy công việc:', err)
    });
  }

  // Các hàm điều khiển Modal ứng tuyển mà HTML của bạn đang gọi
  openApplyModal(): void {
    this.isOpenModal = true;
  }

  closeApplyModal(): void {
    this.isOpenModal = false;
  }

  onOutsideClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeApplyModal();
    }
  }

  onSubmitApply(event: Event): void {
    event.preventDefault();
    alert(`Ứng tuyển thành công cho vị trí: ${this.currentJob?.title}! Chúng tôi sẽ liên hệ lại qua SĐT: ${this.applyForm.phone}`);
    this.closeApplyModal();
  }
}