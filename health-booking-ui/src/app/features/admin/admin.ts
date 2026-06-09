import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 🔥 Đã thêm ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin-service/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  activeTab = 'overview';
  
  // Dữ liệu thống kê tổng quan
  stats = { totalAccounts: 0, totalDoctors: 0, totalPatients: 0, totalAppointments: 0 };
  
  doctors: any[] = [];
  patients: any[] = [];
  appointments: any[] = [];

  // 🔥 Inject thêm ChangeDetectorRef vào constructor để ép Angular vẽ lại giao diện
  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOverviewStats();
  }

  changeTab(tabName: string) {
    this.activeTab = tabName;
    if (tabName === 'overview') this.loadOverviewStats();
    if (tabName === 'doctors') this.loadDoctors();
    if (tabName === 'patients') this.loadPatients();
    if (tabName === 'appointments') this.loadAppointments();
  }

  loadOverviewStats() {
    this.adminService.getStats().subscribe({
      next: (data) => {
        // Sử dụng toán tử spread để bóc tách, tránh lỗi change detection của Angular khi vừa init trang
        this.stats = { ...data };
        this.cdr.detectChanges();
      }
    });
  }

  loadDoctors() {
    this.adminService.getDoctors().subscribe({
      next: (data) => {
        // 🔥 Gán bằng một bản sao mảng mới [...data] để Angular nhận biết vùng nhớ thay đổi
        this.doctors = [...data];
        this.cdr.detectChanges(); // Ép giao diện hiển thị ngay lập tức
      }
    });
  }

  loadPatients() {
    this.adminService.getPatients().subscribe({
      next: (data) => {
        // 🔥 Gán bản sao mảng mới [...data]
        this.patients = [...data];
        this.cdr.detectChanges(); // Ép giao diện hiển thị ngay lập tức
      }
    });
  }

  loadAppointments() {
    this.adminService.getAppointments().subscribe({
      next: (data) => {
        // 🔥 Gán bản sao mảng mới [...data] cho lịch hẹn
        this.appointments = [...data];
        this.cdr.detectChanges(); // Ép giao diện hiển thị ngay lập tức
      }
    });
  }

  saveDoctor(doc: any) {
    this.adminService.updateDoctor(doc.userId, doc).subscribe({
      next: () => {
        alert('✅ Cập nhật thông tin bác sĩ thành công!');
        this.loadDoctors(); // Tải lại danh sách sau khi lưu thành công
      }
    });
  }

  savePatient(pat: any) {
    this.adminService.updatePatient(pat.userId, pat).subscribe({
      next: () => {
        alert('✅ Cập nhật thông tin bệnh nhân thành công!');
        this.loadPatients(); // Tải lại danh sách sau khi lưu thành công
      }
    });
  }

  deleteUser(id: number, currentTab: string) {
    if (confirm('⚠️ Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản thành viên này?')) {
      this.adminService.deleteUser(id).subscribe({
        next: (res) => {
          alert(res.message);
          
          // 🔥 Đặt luồng tải lại dữ liệu trong setTimeout 50ms để Angular kịp giải phóng các thẻ HTML cũ
          setTimeout(() => {
            if (currentTab === 'doctors') {
              this.loadDoctors();
            } else if (currentTab === 'patients') {
              this.loadPatients();
            }
            // Đồng thời cập nhật lại bảng số liệu tổng quan ở trang Dashboard chính
            this.loadOverviewStats();
          }, 50);
        },
        error: (err) => {
          alert(err.error?.message || 'Có lỗi hệ thống xảy ra khi xóa người dùng!');
        }
      });
    }
  }

  deleteAppointment(id: number) {
    if (confirm('❌ Bạn có chắc muốn hủy bỏ và xóa lịch hẹn này không?')) {
      this.adminService.deleteAppointment(id).subscribe({
        next: (res) => {
          alert(res.message);
          
          // 🔥 Cập nhật tức thì danh sách lịch hẹn và bảng số liệu tổng quan
          setTimeout(() => {
            this.loadAppointments();
            this.loadOverviewStats();
          }, 50);
        },
        error: (err) => {
          alert(err.error?.message || 'Có lỗi hệ thống xảy ra khi hủy lịch hẹn!');
        }
      });
    }
  }
  confirmAppointment(id: number) {
    if (confirm('🗓️ Bạn có chắc chắn muốn duyệt và xác nhận lịch hẹn khám này không?')) {
      this.adminService.confirmAppointment(id).subscribe({
        next: (res) => {
          alert(res.message);
          
          // Tải lại danh sách lịch hẹn và bảng thống kê Dashboard ngay lập tức
          setTimeout(() => {
            this.loadAppointments();
            this.loadOverviewStats();
          }, 50);
        },
        error: (err) => {
          alert(err.error?.message || 'Có lỗi hệ thống xảy ra khi xác nhận lịch hẹn!');
        }
      });
    }
  }
}