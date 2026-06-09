import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export class EditProfileComponent implements OnInit {
  private baseUrl = 'https://localhost:7291/api/patient'; // Nhớ đổi đúng Port C# chạy thực tế của bạn nhen

  // Khởi tạo Object cấu trúc chuẩn để khớp dữ liệu
  profileData: any = {
    userId: 0,
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: ''
  };

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

 ngOnInit(): void {
  let loggedInUserId = 0;

  // Đọc chuẩn key 'user_id' từ login gửi qua
  const storedId = localStorage.getItem('user_id');
  
  if (storedId) {
    loggedInUserId = parseInt(storedId, 10);
  } else {
    const userJson = localStorage.getItem('currentUser') || localStorage.getItem('user');
    if (userJson) {
      const loggedInUser = JSON.parse(userJson);
      loggedInUserId = loggedInUser.userId || loggedInUser.id || loggedInUser.UserId;
    }
  }

  if (!loggedInUserId || loggedInUserId === 0) {
    alert('Không tìm thấy thông tin đăng nhập! 🔐');
    return;
  }

  console.log("🚀 Trang Đổi Mật Khẩu nhận đúng ID là:", loggedInUserId);
  this.fetchCurrentProfile(loggedInUserId);
}

  fetchCurrentProfile(userId: number) {
    this.http.get<any>(`${this.baseUrl}/profile/${userId}`).subscribe({
      next: (res) => {
        console.log("🎉 Dữ liệu C# trả về chuẩn chỉnh:", res);
        if (res && res.success && res.model) {
          
          // Gán toàn bộ data vào object profileData để đưa lên form
          this.profileData.userId = res.model.userId;
          this.profileData.fullName = res.model.fullName;
          this.profileData.email = res.model.email;
          this.profileData.phone = res.model.phone;
          this.profileData.address = res.model.address;
          this.profileData.dateOfBirth = res.model.dateOfBirth;
          this.profileData.avatar = res.model.avatar || 'assets/images/default-avatar.png';

          // 🔥 TUYỆT CHIÊU THẦN THÁNH: Ép Angular cập nhật giao diện ngay lập tức!
          // Sẽ giải quyết việc "phải chạm vào ô input/click ra ngoài chữ mới hiện"
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('❌ Lỗi gọi API lấy hồ sơ:', err);
      }
    });
  }

  // Hàm POST: Gửi cục dữ liệu đã chỉnh sửa lên C# để cập nhật database
  onUpdateProfile() {
    if (this.profileData.newPassword && this.profileData.newPassword !== this.profileData.confirmPassword) {
      alert('Xác nhận mật khẩu mới không trùng khớp kìa bạn ơi! ❌');
      return;
    }

    // TẠO CỤC DỮ LIỆU ĐỂ GỬI ĐI: Ép viết hoa/viết thường đúng chuẩn DTO bên C#
    // Bạn hãy kiểm tra file EditProfileDto.cs xem các từ này có viết hoa chữ cái đầu không nhen!
    const payload = {
      UserId: this.profileData.userId,
      FullName: this.profileData.fullName,
      Email: this.profileData.email,
      Phone: this.profileData.phone,
      Address: this.profileData.address,
      DateOfBirth: this.profileData.dateOfBirth,
      
      // Khớp chuẩn với dto.CurrentPassword, dto.NewPassword, dto.ConfirmPassword của C#
      CurrentPassword: this.profileData.currentPassword || '', 
      NewPassword: this.profileData.newPassword || '',
      ConfirmPassword: this.profileData.confirmPassword || ''
    };

    console.log("📦 Dữ liệu gộp gửi lên C# xử lý:", payload);

    this.http.post<any>(`${this.baseUrl}/edit-profile`, payload).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Cập nhật hồ sơ và đổi mật khẩu thành công! 🎉');
          
          // Xóa trống ô mật khẩu sau khi đổi thành công
          this.profileData.currentPassword = '';
          this.profileData.newPassword = '';
          this.profileData.confirmPassword = '';
          
          this.cdr.detectChanges();
          this.router.navigate(['/patient']); 
        } else {
          alert('Thất bại: ' + res.message);
        }
      },
      error: (err) => {
        console.error('Lỗi gọi API lưu dữ liệu:', err);
        // Hiện thông báo lỗi thật từ C# trả về lên màn hình
        const serverErrorMessage = err.error?.message || 'Có lỗi xảy ra trong quá trình lưu dữ liệu!';
        alert(serverErrorMessage); 
      }
    });
  }
}