import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Đặt tên interface mới hoàn toàn để không bao giờ bị trùng lặp hệ thống
interface AngularJobModel {
  id: number;
  title: string;
  type: string;
  description: string;
}

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetail implements OnInit {
  isOpenModal = false;

  applyForm = {
    name: '',
    email: '',
    phone: '',
    coverLetter: ''
  };

  // Định kiểu bằng tên interface mới
  currentJob: AngularJobModel | undefined;

  // Ép kiểu mảng chắc chắn có thuộc tính 'id'
  private mockJobsData: AngularJobModel[] = [
    { id: 1, title: 'Phát Triển Kinh Doanh (B2B)', type: 'Full Time', description: 'Tìm kiếm và phát triển khách hàng doanh nghiệp.' },
    { id: 2, title: 'Chuyên Viên Hành Chính Nhân Sự', type: 'Full Time', description: 'Quản lý hồ sơ nhân sự, tuyển dụng và hành chính văn phòng.' },
    { id: 3, title: 'Kế Toán Viên Kiêm Chăm Sóc Khách Hàng', type: 'Full Time', description: 'Theo dõi công nợ, lập báo cáo và hỗ trợ khách hàng.' },
    { id: 4, title: 'Thực Tập Sinh Content Marketing', type: 'Part Time', description: 'Hỗ trợ xây dựng nội dung cho website và mạng xã hội.' },
    { id: 5, title: 'Giám Đốc Phát Triển Kinh Doanh - Dịch Vụ', type: 'Full Time', description: 'Xây dựng chiến lược kinh doanh và mở rộng thị trường.' },
    { id: 6, title: 'Business Analyst', type: 'Full Time', description: 'Phân tích yêu cầu nghiệp vụ và đề xuất giải pháp.' },
    { id: 7, title: 'Frontend ReactJS Developer', type: 'Full Time', description: 'Phát triển giao diện web bằng ReactJS.' },
    { id: 8, title: 'Backend NodeJS Developer', type: 'Full Time', description: 'Xây dựng API và hệ thống backend bằng NodeJS.' },
    { id: 9, title: 'Mobile App Developer (iOS/Android)', type: 'Full Time', description: 'Phát triển ứng dụng di động đa nền tảng.' },
    { id: 10, title: 'Digital Marketing Specialist', type: 'Part Time', description: 'Thực hiện các chiến dịch quảng cáo và marketing.' },
    { id: 11, title: 'Data Analyst Intern', type: 'Internship', description: 'Hỗ trợ phân tích dữ liệu và lập báo cáo.' },
    { id: 12, title: 'UI/UX Designer', type: 'Full Time', description: 'Thiết kế giao diện và tối ưu trải nghiệm người dùng.' },
    { id: 13, title: 'Product Manager', type: 'Full Time', description: 'Quản lý sản phẩm từ ý tưởng đến triển khai.' },
    { id: 14, title: 'QA Engineer', type: 'Full Time', description: 'Kiểm thử phần mềm và đảm bảo chất lượng sản phẩm.' },
    { id: 15, title: 'Senior Technical Writer', type: 'Part Time', description: 'Biên soạn tài liệu kỹ thuật và hướng dẫn sử dụng.' },
    { id: 16, title: 'DevOps Engineer', type: 'Full Time', description: 'Quản lý CI/CD và hạ tầng hệ thống.' },
    { id: 17, title: 'Graphics Designer Intern', type: 'Internship', description: 'Thiết kế hình ảnh cho website và marketing.' }
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    this.currentJob = this.mockJobsData.find(job => job.id === jobId);

    if (!this.currentJob) {
      this.currentJob = {
        id: 0,
        title: 'Không tìm thấy vị trí',
        type: '',
        description: 'Thông tin tuyển dụng không tồn tại.'
      };
    }
  }

  getJobTypeLabel(type: string | undefined): string {
    if (!type) return '';
    switch (type.toLowerCase().trim()) {
      case 'full time':
      case 'full-time': return 'Full Time';
      case 'part time':
      case 'part-time': return 'Part Time';
      case 'internship': return 'Thực tập sinh';
      default: return type;
    }
  }

  openApplyModal() { this.isOpenModal = true; }
  closeApplyModal() { this.isOpenModal = false; }

  onOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.id === 'applyModal') {
      this.closeApplyModal();
    }
  }

  onSubmitApply(event: Event) {
    event.preventDefault();
    alert(`Gửi đơn ứng tuyển vị trí "${this.currentJob?.title}" thành công! Cảm ơn ${this.applyForm.name}.`);
    this.closeApplyModal();
    this.applyForm = { name: '', email: '', phone: '', coverLetter: '' };
  }
}