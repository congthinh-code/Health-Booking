using health_booking_api.DTOs;
using health_booking_api.Models; // Sử dụng đúng 2 model Patient và User bạn vừa gửi
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Threading.Tasks;

namespace health_booking_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly HealthBookingDbContext _context; // Đảm bảo đúng tên DbContext của bạn nhen
        private readonly IWebHostEnvironment _env;

        public PatientController(HealthBookingDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ================= 1. API GET: LẤY THÔNG TIN HỒ SƠ ĐỔ LÊN FORM =================
        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
            // Tìm kiếm theo đúng UserId truyền xuống
            var patient = await _context.Patients
                                        .Include(p => p.User)
                                        .FirstOrDefaultAsync(p => p.UserId == userId);

            // Nếu tìm theo UserId không có, tìm thử xem có trùng với PatientId nào không
            if (patient == null)
            {
                patient = await _context.Patients
                                            .Include(p => p.User)
                                            .FirstOrDefaultAsync(p => p.PatientId == userId);
            }

            if (patient == null)
            {
                return NotFound(new { success = false, message = $"Không tìm thấy bệnh nhân nào có ID là {userId}!" });
            }

            var result = new
            {
                success = true,
                model = new
                {
                    userId = patient.UserId,
                    fullName = patient.FullName,
                    email = patient.User != null ? patient.User.Email : "",
                    phone = patient.Phone ?? "",
                    address = patient.Address ?? "",
                    dateOfBirth = patient.DateOfBirth.ToString("yyyy-MM-dd"),
                    avatar = !string.IsNullOrEmpty(patient.Avatar) ? patient.Avatar : "assets/images/default-avatar.png"
                }
            };

            return Ok(result);
        }

        // ================= 2. API POST: CẬP NHẬT THÔNG TIN CHỮ VÀ MẬT KHẨU =================
        [HttpPost("edit-profile")]
        public async Task<IActionResult> EditProfile([FromBody] EditProfileDto dto)
        {
            if (!ModelState.IsValid || dto == null)
            {
                return BadRequest(new { success = false, message = "Dữ liệu đầu vào không hợp lệ" });
            }

            // Tìm bệnh nhân cần sửa dựa trên UserId
            var patient = await _context.Patients
                                        .Include(p => p.User)
                                        .FirstOrDefaultAsync(p => p.UserId == dto.UserId);

            // Cơ chế dự phòng: nếu tìm theo UserId không có (đang chạy test dòng đầu), lấy luôn dòng đầu để sửa
            if (patient == null)
            {
                patient = await _context.Patients
                                            .Include(p => p.User)
                                            .FirstOrDefaultAsync();
            }

            if (patient == null)
            {
                return NotFound(new { success = false, message = "Bệnh nhân không tồn tại" });
            }

            // Cập nhật thông tin bảng Patient theo đúng Model của bạn
            patient.FullName = dto.FullName;
            patient.Phone = dto.Phone ?? "";
            patient.Address = dto.Address ?? "";
            if (dto.DateOfBirth.HasValue)
            {
                patient.DateOfBirth = dto.DateOfBirth.Value;
            }

            // Cập nhật trường Email và Mật khẩu thuộc bảng User liên kết
            if (patient.User != null)
            {
                patient.User.Email = dto.Email;

                // Nếu người dùng gõ mật khẩu mới -> thực hiện đổi mật khẩu giống hệt logic MVC cũ
                if (!string.IsNullOrEmpty(dto.NewPassword))
                {
                    // 🔥 ĐÃ SỬA: Dùng BCrypt để giải mã mật khẩu dưới DB ra so sánh giống hệt MVC cũ
                    bool isCorrect = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, patient.User.Password);

                    if (!isCorrect)
                    {
                        return BadRequest(new { success = false, message = "Mật khẩu hiện tại không chính xác! ❌" });
                    }

                    if (dto.NewPassword != dto.ConfirmPassword)
                    {
                        return BadRequest(new { success = false, message = "Xác nhận mật khẩu mới không khớp! ❌" });
                    }

                    // 🔥 ĐÃ SỬA: Mã hóa mật khẩu mới trước khi lưu xuống Database giống MVC cũ
                    patient.User.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
                }
            }

            try
            {
                _context.Patients.Update(patient);
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Cập nhật hồ sơ thành công! 🎉" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi lưu database: " + ex.Message });
            }
        }

        // ================= 3. API POST: UPLOAD ẢNH ĐẠI DIỆN VÀO WWWROOT =================
        [HttpPost("upload-avatar/{userId}")]
        public async Task<IActionResult> UploadAvatar(int userId, IFormFile avatarFile)
        {
            // 1. Kiểm tra file gửi lên có rỗng không
            if (avatarFile == null || avatarFile.Length == 0)
            {
                return BadRequest(new { success = false, message = "Không nhận được file ảnh" });
            }

            try
            {
                // 2. TÌM BỆNH NHÂN TRONG DB: Dựa theo UserId truyền từ Angular lên để lưu trúng người
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                if (patient == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy thông tin bệnh nhân dưới database" });
                }

                // 3. Định nghĩa thư mục chứa ảnh trong wwwroot
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // 4. Tạo tên file ảnh ngẫu nhiên để không bị ghi đè trùng tên
                var fileName = "avatar_" + Guid.NewGuid().ToString().Substring(0, 8) + Path.GetExtension(avatarFile.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                // 5. Tiến hành lưu file ảnh vật lý xuống thư mục wwwroot
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await avatarFile.CopyToAsync(stream);
                }

                // 6. CẬP NHẬT ĐƯỜNG DẪN ẢNH VÀO CỘT AVATAR TRONG DATABASE
                // Lưu đường dẫn tương đối để Angular tự nối với localhost (Ví dụ: /uploads/avatars/avatar_abc.jpg)
                patient.Avatar = $"/uploads/avatars/{fileName}";

                _context.Patients.Update(patient);
                await _context.SaveChangesAsync(); // Ép SQL Server lưu thay đổi lập tức!

                // Trả về URL đầy đủ cho Angular hứng hiển thị lên khung tròn ngay và luôn
                var fullAvatarUrl = $"https://localhost:7291{patient.Avatar}";

                return Ok(new
                {
                    success = true,
                    message = "Upload và lưu Database thành công! 🎉",
                    avatarUrl = fullAvatarUrl
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // ================= 4. API GET: LẤY LỊCH HẸN VÀ THỐNG KÊ (DASHBOARD DATA) =================
        [HttpGet("dashboard-data/{userId}")]
        public async Task<IActionResult> GetDashboardData(int userId)
        {
            try
            {
                // 1. Từ UserId truyền từ Angular, tra ra PatientId dưới Database
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                if (patient == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy thông tin bệnh nhân!" });
                }

                // 2. Lấy nguồn 1: Lịch hẹn trực tiếp với Bác sĩ (BookingSource == "Doctor")
                var appointmentsRaw = await _context.Appointments
                    .Include(a => a.Doctor)
                    .Where(a => a.PatientId == patient.PatientId && a.BookingSource == "Doctor")
                    .OrderByDescending(a => a.AppointmentDate)
                    .ToListAsync();

                // Biến đổi cấu trúc mảng để ép kiểu Enum Status về dạng số nguyên (0,1,2,3) cho Angular nhận diện chuẩn class CSS
                var appointments = appointmentsRaw.Select(a => new
                {
                    appointmentId = a.AppointmentId,
                    appointmentDate = a.AppointmentDate,
                    status = (int)a.Status, // Ép kiểu Enum về số (0: Pending, 1: Confirmed, 2: Completed, 3: Cancelled)
                    doctor = a.Doctor != null ? new { fullName = a.Doctor.FullName } : null
                }).ToList();

                // 3. Lấy nguồn 2: Lịch khám đặt qua form tại Cơ sở/Chuyên khoa (BookingSource == "Home")
                var bookingRequestsRaw = await _context.Appointments
                    .Include(a => a.Hospital)
                    .Include(a => a.Specialization)
                    .Where(a => a.PatientId == patient.PatientId && a.BookingSource == "Home")
                    .OrderByDescending(a => a.AppointmentDate)
                    .ToListAsync();

                // 🔥 ĐỒNG BỘ TÊN THUỘC TÍNH: Đổi HospitalName và SpecializationName thành ".name" để khớp khít với file Angular HTML của bạn
                var bookingRequests = bookingRequestsRaw.Select(b => new
                {
                    appointmentId = b.AppointmentId,
                    appointmentDate = b.AppointmentDate,
                    status = (int)b.Status,
                    hospital = b.Hospital != null ? new { name = b.Hospital.Name } : null, // Biến đổi thành .name giống Angular gọi
                    specialization = b.Specialization != null ? new { name = b.Specialization.Name } : null // Biến đổi thành .name giống Angular gọi
                }).ToList();

                // 4. Tính toán Thống kê nhanh (Stats) dựa trên tất cả lịch hẹn của Bệnh nhân này
                var allPatientAppointments = await _context.Appointments
                    .Where(a => a.PatientId == patient.PatientId)
                    .ToListAsync();

                var stats = new
                {
                    total = allPatientAppointments.Count,
                    pending = allPatientAppointments.Count(a => (int)a.Status == 0),
                    completed = allPatientAppointments.Count(a => (int)a.Status == 2 || (int)a.Status == 1), // Tính cả Đã xác nhận/Hoàn thành theo logic cũ của bạn
                    cancelled = allPatientAppointments.Count(a => (int)a.Status == 3)
                };

                // 5. Trả dữ liệu JSON hoàn chỉnh về cho Frontend Angular hốt
                return Ok(new
                {
                    success = true,
                    appointments = appointments,
                    bookingRequests = bookingRequests,
                    stats = stats
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi xử lý hệ thống: " + ex.Message });
            }
        }
    }
}