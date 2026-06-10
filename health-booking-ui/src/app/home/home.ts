import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FALLBACK_LOGO, specialtyIconPath } from '../core/utils/image.util';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  constructor(
    private titleService: Title,
    private http: HttpClient,
    private eRef: ElementRef,
    private router: Router
  ) {
    this.todayStr = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.titleService.setTitle('HealthBookingUi'); 
    this.loadBookingFormData();
    this.initSearchDebounce();
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

  searchQuery: string = '';
  searchResults: any[] = [];
  showSearchResults: boolean = false;
  private searchSubject = new Subject<string>();

  isModalOpen: boolean = false;
  isSubmitting: boolean = false;
  todayStr: string = '';

  hospitals: any[] = [];
  formSpecializations: any[] = [];

  bookingData = {
    userId: 1,
    patientName: '',
    phone: '',
    hospitalId: '',
    specializationId: '',
    doctorUserId: '',
    appointmentDate: '',
    appointmentTime: ''
  };

  loadBookingFormData(): void {
    this.http.get<any>('https://localhost:7291/api/CSYT/GetBookingFormData').subscribe({
      next: (res) => {
        this.hospitals = res.hospitals;
        this.formSpecializations = res.specializations;
      },
      error: (err) => { console.error('Lỗi load dữ liệu form:', err); }
    });
  }

  initSearchDebounce() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.trim().length === 0) {
          this.searchResults = [];
          this.showSearchResults = false;
          return of([]);
        }
        // Đặt luôn trạng thái hiển thị khung là true để phục vụ hiển thị thông báo trống
        this.showSearchResults = true;
        return this.http.get<any[]>(`https://localhost:7291/api/Search/GetSearch?q=${encodeURIComponent(query)}`);
      })
    ).subscribe({
      next: (data) => {
        this.searchResults = data;
        // Luôn luôn bằng true để HTML có thể kiểm tra xem mảng có data hay rỗng để hiện thông báo lỗi
        this.showSearchResults = true; 
      }
    });
  }

  onSearchInput() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.showSearchResults = false;
      return;
    }
    this.searchSubject.next(this.searchQuery);
  }

  navigateToSearchResult(item: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    const internalUrl = this.getSearchResultUrl(item);
    if (!internalUrl) {
      return;
    }

    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchResults = false;

    this.router.navigateByUrl(internalUrl);
  }

  private getSearchResultUrl(item: any): string | null {
    const id = item?.id;

    if (id == null) {
      return null;
    }

    switch (item?.type) {
      case 'doctor':
        return `/pages/DVYT/dkbs?doctorId=${encodeURIComponent(id)}`;
      case 'hospital':
        return `/pages/DVYT/dkcs?hospitalId=${encodeURIComponent(id)}`;
      case 'specialization':
      case 'specialty':
        return `/pages/DVYT/dkck?specializationId=${encodeURIComponent(id)}`;
      default:
        return null;
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    this.showSearchResults = false;
  }

  // Hiện dropdown khi click vào ô tìm kiếm
  onInputClick(event?: Event) {
    event?.stopPropagation();
    if (this.searchQuery.trim().length > 0) {
      this.showSearchResults = true;
    }
  }

  openBooking(hospitalId?: number, specializationId?: number, doctorUserId?: number) {
    // 1. TẠM ẨN KIỂM TRA ĐĂNG NHẬP ĐỂ BẠN THOẢI MÁI TEST FORM ĐẶT LỊCH KHÁM
    
    // const isLoggedIn = (window as any).isLoggedIn;
    // if (!isLoggedIn) {
    //   alert("Quý khách chưa đăng nhập tài khoản. Vui lòng đăng nhập để tiếp tục.");
    //   window.location.href = '/Account/Login';
    //   return;
    // }
    

    // 2. Mở Modal trực tiếp
    this.isModalOpen = true;

    // 3. Tự động điền dữ liệu từ thanh tìm kiếm autocomplete vào form
    if (hospitalId) {
      this.bookingData.hospitalId = hospitalId.toString();
    }
    if (specializationId) {
      this.bookingData.specializationId = specializationId.toString();
    }
  }

  closeBooking() {
    this.isModalOpen = false;
    this.isSubmitting = false;
    this.bookingData = {
      userId: 1, patientName: '', phone: '', hospitalId: '',
      specializationId: '', doctorUserId: '', appointmentDate: '', appointmentTime: ''
    };
  }

  validateDateTime(): boolean {
    if (!this.bookingData.appointmentDate || !this.bookingData.appointmentTime) return true;
    const selectedDateTime = new Date(`${this.bookingData.appointmentDate}T${this.bookingData.appointmentTime}`);
    const currentDateTime = new Date();

    if (selectedDateTime < currentDateTime) {
      alert("Thời gian đặt khám không được nhỏ hơn giờ hiện tại của ngày hôm nay!");
      this.bookingData.appointmentTime = '';
      return false;
    }
    return true;
  }

  markFormDirty(form: any) {
    alert("Vui lòng nhập đầy đủ các thông tin bắt buộc!");
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  }

  submitBooking() {
    if (!this.validateDateTime()) return;
    this.isSubmitting = true;

    this.http.post<any>('https://localhost:7291/api/Booking/ProcessBooking', this.bookingData).subscribe({
      next: (res) => {
        // Hiển thị nội dung thông báo trả về từ API C# (Thành công / Thất bại)
        alert(res.message); 
        
        if (res.success) {
          this.closeBooking(); // Đặt lịch thành công -> Đóng Modal, xoá dữ liệu cũ trên form
        } else {
          this.isSubmitting = false; // Nếu API báo lỗi dữ liệu, giữ nguyên form cho người dùng sửa
        }
      },
      error: (err) => {
        console.error('Lỗi kết nối API:', err);
        alert('Không thể kết nối đến máy chủ API C#. Hãy chắc chắn bạn đã chạy dự án Back-end (Port 7291).');
        this.isSubmitting = false;
      }
    });
  }
}