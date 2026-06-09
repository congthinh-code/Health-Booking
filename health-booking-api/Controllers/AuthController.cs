using health_booking_api.Models;
using health_booking_api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text.RegularExpressions;
using BCryptNet = BCrypt.Net.BCrypt;

namespace health_booking_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly HealthBookingDbContext _context;

        public AuthController(HealthBookingDbContext context)
        {
            _context = context;
        }

        // 1. ĐĂNG KÝ (Chuyển đổi từ dangky.php)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.HoTen) || string.IsNullOrWhiteSpace(dto.NgaySinh) ||
                string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.MatKhau))
            {
                return BadRequest(new { success = false, message = "⚠️ Vui lòng nhập đầy đủ thông tin!" });
            }

            // Kiểm tra mật khẩu (Regex từ dangky.php)
            var passwordPattern = @"^[A-Z].*[!@#$%^&*()_+\-=\[\]{};':""\\|,.<>\/?]$";
            if (!Regex.IsMatch(dto.MatKhau, passwordPattern))
            {
                return BadRequest(new { success = false, message = "⚠️ Mật khẩu phải bắt đầu bằng chữ in hoa và kết thúc bằng kí tự đặc biệt." });
            }

            // Kiểm tra email tồn tại
            var emailExists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            if (emailExists)
            {
                return BadRequest(new { success = false, message = "⚠️ Email đã được sử dụng! Vui lòng chọn email khác." });
            }

            if (!DateTime.TryParseExact(dto.NgaySinh, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDate))
            {
                return BadRequest(new { success = false, message = "⚠️ Ngày sinh không đúng định dạng DD/MM/YYYY!" });
            }

            // Sinh mã xác thực ngẫu nhiên 6 chữ số
            string generatedCode = new Random().Next(100000, 999999).ToString();

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                string dbRole = char.ToUpper(dto.Role[0]) + dto.Role.Substring(1).ToLower();

                // Vì tài khoản chưa xác thực, lưu tạm chuỗi "PENDING_VERIFY:" kèm mật khẩu gốc chưa hash 
                // Điều này giúp phân biệt tài khoản chưa kích hoạt mà không cần sửa cấu trúc cột database.
                var newUser = new User
                {
                    Email = dto.Email,
                    Password = $"PENDING_VERIFY:{dto.MatKhau}",
                    Role = dbRole,
                    CreatedAt = DateTime.Now
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                if (dbRole == "Patient")
                {
                    var newPatient = new Patient
                    {
                        UserId = newUser.UserId,
                        FullName = dto.HoTen,
                        DateOfBirth = parsedDate,
                        Gender = "Chưa cập nhật",
                        Phone = dto.SoDienThoai ?? "",
                        Address = dto.DiaChi ?? ""
                    };
                    _context.Patients.Add(newPatient);
                }
                else if (dbRole == "Doctor")
                {
                    var newDoctor = new Doctor
                    {
                        UserId = newUser.UserId,
                        FullName = dto.HoTen,
                        Phone = dto.SoDienThoai ?? "",
                        ExperienceYears = 0,
                        Description = "Chưa cập nhật mô tả",
                        SpecializationId = 1,
                        HospitalId = 1
                    };
                    _context.Doctors.Add(newDoctor);
                }

                // Lưu mã xác thực vào bảng Notification có sẵn trường Message
                var notification = new Notification
                {
                    UserId = newUser.UserId,
                    Message = $"VERIFY_CODE:{generatedCode}",
                    CreatedAt = DateTime.Now,
                    IsRead = false
                };
                _context.Notifications.Add(notification);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    success = true,
                    message = "Đăng ký thành công! Vui lòng xác thực tài khoản.",
                    email = dto.Email,
                    verifyCode = generatedCode
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        // 2. XÁC MINH MÃ (Chuyển đổi từ verify.php)
        [HttpPost("verify")]
        public async Task<IActionResult> VerifyAccount([FromBody] VerifyDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
            {
                return BadRequest(new { success = false, message = "❌ Email không tồn tại!" });
            }

            if (!user.Password.StartsWith("PENDING_VERIFY:"))
            {
                return BadRequest(new { success = false, message = "⚠️ Tài khoản này đã được xác minh từ trước!" });
            }

            // Tìm mã xác thực gần nhất trong bảng Notifications của User này
            var lastNotification = await _context.Notifications
                .Where(n => n.UserId == user.UserId && n.Message.StartsWith("VERIFY_CODE:"))
                .OrderByDescending(n => n.CreatedAt)
                .FirstOrDefaultAsync();

            if (lastNotification == null || lastNotification.Message != $"VERIFY_CODE:{dto.VerifyCode}")
            {
                return BadRequest(new { success = false, message = "❌ Mã xác minh không chính xác!" });
            }

            // Lấy mật khẩu gốc ra để băm BCrypt chính thức kích hoạt tài khoản
            string rawPassword = user.Password.Replace("PENDING_VERIFY:", "");
            user.Password = BCryptNet.HashPassword(rawPassword); // Băm mật khẩu bằng BCrypt

            // Xóa thông báo chứa mã cũ để dọn dẹp dữ liệu
            _context.Notifications.Remove(lastNotification);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "✅ Xác minh tài khoản thành công! Bạn có thể đăng nhập ngay." });
        }

        // 3. GỬI LẠI MÃ XÁC THỰC (Đã cấu trúc lại để tránh lỗi xác mấu dữ liệu trống)
        [HttpPost("resend-code")]
        public async Task<IActionResult> ResendCode([FromBody] ResendCodeDto dto) // 🔥 Đã đổi từ VerifyDto thành ResendCodeDto
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
            {
                return BadRequest(new { success = false, message = "❌ Email không tồn tại!" });
            }

            if (!user.Password.StartsWith("PENDING_VERIFY:"))
            {
                return BadRequest(new { success = false, message = "⚠️ Tài khoản đã được xác minh!" });
            }

            string newCode = new Random().Next(100000, 999999).ToString();

            var notification = new Notification
            {
                UserId = user.UserId,
                Message = $"VERIFY_CODE:{newCode}",
                CreatedAt = DateTime.Now,
                IsRead = false
            };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "✅ Đã tạo và gửi lại mã xác minh mới thành công!", newCode = newCode });
        }

        // 4. ĐĂNG NHẬP (Chuyển đổi từ login.php)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Patient)
                .Include(u => u.Doctor)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
            {
                return BadRequest(new { success = false, message = "Tài khoản không tồn tại" });
            }

            // Nếu mật khẩu vẫn chứa chuỗi PENDING_VERIFY -> Tài khoản chưa kích hoạt
            if (user.Password.StartsWith("PENDING_VERIFY:"))
            {
                return BadRequest(new { success = false, isNotVerified = true, message = "⚠️ Tài khoản chưa kích hoạt! Vui lòng xác thực trước." });
            }

            // Kiểm tra mật khẩu băm BCrypt tương thích hoàn toàn với password_verify của PHP
            if (!BCryptNet.Verify(dto.Password, user.Password))
            {
                return BadRequest(new { success = false, message = "Sai mật khẩu" });
            }

            // Lấy thông tin hiển thị như file login.php cũ của bạn
            string displayName = user.Email;
            string? avatarUrl = null;

            if (user.Role == "Doctor" && user.Doctor != null)
            {
                displayName = user.Doctor.FullName;
                avatarUrl = user.Doctor.Avatar;
            }
            else if (user.Role == "Patient" && user.Patient != null)
            {
                displayName = user.Patient.FullName;
                avatarUrl = user.Patient.Avatar;
            }

            return Ok(new
            {
                success = true,
                userId = user.UserId,
                role = user.Role.ToLower(),
                name = displayName,
                avatar = avatarUrl ?? "",
                message = "Đăng nhập thành công!"
            });
        }
    }
}