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
    
    if (item.url) {
      // Xóa ô tìm kiếm và ẩn dropdown
      this.searchQuery = '';
      this.showSearchResults = false;
      
      // Parse URL để tách path và query string
      // URL từ API: /DVYT/ĐKBS?id=17
      const urlParts = item.url.split('?');
      const pathPart = urlParts[0]; // /DVYT/ĐKBS
      const queryPart = urlParts[1]; // id=17
      
      // Decode path: /DVYT/ĐKBS -> pages/DVYT/dkbs
      const normalizedPath = this.normalizeRoutePath(pathPart);
      
      // Parse query parameters
      const queryParams: any = {};
      if (queryPart) {
        queryPart.split('&').forEach((param: string) => {
          const [key, value] = param.split('=');
          if (key && value) {
            // Map API parameter names to component parameter names
            let paramKey = key;
            if (key === 'id' && normalizedPath.includes('dkbs')) {
              paramKey = 'doctorId'; // API trả về 'id', nhưng component cần 'doctorId'
            }
            queryParams[paramKey] = decodeURIComponent(value);
          }
        });
      }
      
      const queryString = Object.keys(queryParams).length > 0
        ? `?${new URLSearchParams(queryParams).toString()}`
        : '';
      const internalUrl = `/${normalizedPath}${queryString}`;

      console.log('Navigate to:', internalUrl);

      // Navigate bằng URL hoàn chỉnh để tránh router tách sai segment
      this.router.navigateByUrl(internalUrl);
    }
  }

  // Normalize path: chuyển ký tự Tiếng Việt thành ASCII, thêm prefix pages/
  private normalizeRoutePath(path: string): string {
    // Xóa dấu / ở đầu
    let normalized = path.startsWith('/') ? path.substring(1) : path;
    
    // Map các ký tự Tiếng Việt sang route path
    const pathMap: { [key: string]: string } = {
      'ĐKBS': 'dkbs',   // Đặt khám bác sĩ -> dkbs
      'ĐKCK': 'dkck',   // Đặt khám chuyên khoa -> dkck
      'ĐKCS': 'dkcs',   // Đặt khám tại cơ sở -> dkcs
      'ĐKNG': 'dkng',   // Đặt khám ngoài -> dkng
      'TTVP': 'ttvp'    // Tra tìm thông tin -> ttvp
    };

    // Replace từng ký tự Tiếng Việt bằng lowercase tương ứng
    for (const [key, value] of Object.entries(pathMap)) {
      normalized = normalized.replace(new RegExp(key, 'i'), value);
    }
    
    // Thêm prefix 'pages/' nếu không có
    if (!normalized.startsWith('pages/')) {
      normalized = 'pages/' + normalized;
    }
    
    return normalized;
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