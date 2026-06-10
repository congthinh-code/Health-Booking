import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  specialties = [
    { label: 'Bác sĩ gia đình', fileName: 'Bác sĩ gia đình' },
    { label: 'Da liễu', fileName: 'Da liễu' },
    { label: 'Mắt', fileName: 'Mắt' },
    { label: 'Ngoại cơ xương khớp', fileName: 'Ngoại cơ xương khớp' },
    { label: 'Nội cơ xương khớp', fileName: 'Nội cơ xương khớp' },
    { label: 'Nội hô hấp', fileName: 'Nội hô hấp' },
    { label: 'Nội thần kinh', fileName: 'Nội thần kinh' },
    { label: 'Nội tiết niệu', fileName: 'Nội tiết niệu' },
    { label: 'Nội tiết', fileName: 'Nội tiết' },
    { label: 'Nội tiêu hóa', fileName: 'Nội tiêu hoá' },
    { label: 'Nội tim mạch', fileName: 'Nội tim mạch' },
    { label: 'Nội tổng quát', fileName: 'Nội tổng quát' },
    { label: 'Sản - Phụ khoa', fileName: 'Sản - phụ khoa' },
    { label: 'Tai mũi họng', fileName: 'Tai mũi họng' },
    { label: 'Tiêu hóa gan mật', fileName: 'Tiêu hoá gan mật' }
  ];
clickedInsideSearch: boolean = false;
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

  constructor(private http: HttpClient, private eRef: ElementRef) {
    this.todayStr = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadBookingFormData();
    this.initSearchDebounce();
  }

  loadBookingFormData() {
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
      debounceTime(0),
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



  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    // Nếu click hoàn toàn ra ngoài (không đi qua ô tìm kiếm) thì ẩn dropdown
    if (!this.clickedInsideSearch) {
      this.showSearchResults = false;
    }
    // Reset lại trạng thái để chuẩn bị cho lượt click tiếp theo
    this.clickedInsideSearch = false;
  }

  // Hàm xử lý riêng khi người dùng click vào ô input tìm kiếm
  onInputClick() {
    this.clickedInsideSearch = true; // Đánh dấu click nội bộ
    if (this.searchQuery.trim().length > 0) {
      this.showSearchResults = true; // Hiện lại dropdown nếu đã có chữ
    }
  }

 selectSearchResult(item: any, event: Event) {
    // Ngăn chặn hành động click mặc định của thẻ <a>
    event.preventDefault();
    
    // Ẩn luôn dropdown và xóa chữ trong ô tìm kiếm sau khi chọn
    this.showSearchResults = false;
    this.searchQuery = '';

    // Chỉ xử lý nhảy vào form cho Bệnh viện hoặc Chuyên khoa
    if (item.type === 'hospital') {
      this.openBooking(item.id, undefined);
    } else if (item.type === 'specialization' || item.type === 'specialty') {
      this.openBooking(undefined, item.id);
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