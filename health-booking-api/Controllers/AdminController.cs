using health_booking_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace health_booking_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly HealthBookingDbContext _context;

        public AdminController(HealthBookingDbContext context)
        {
            _context = context;
        }

        /* =======================================================
            1. TAB TỔNG QUAN: THỐNG KÊ SỐ LƯỢNG
           ======================================================= */
        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var totalAccounts = await _context.Users.CountAsync();

            // 🔥 ĐÃ SỬA: Dùng ToLower() để lọc an toàn bất kể DB lưu "Doctor" hay "doctor"
            var totalDoctors = await _context.Users.CountAsync(u => u.Role.ToLower() == "doctor");
            var totalPatients = await _context.Users.CountAsync(u => u.Role.ToLower() == "patient");
            var totalAppointments = await _context.Appointments.CountAsync();

            // 🔥 ĐÃ SỬA: Ép tên biến trả về chữ thường (camelCase) khớp 100% với file admin.html
            return Ok(new
            {
                totalAccounts = totalAccounts,
                totalDoctors = totalDoctors,
                totalPatients = totalPatients,
                totalAppointments = totalAppointments
            });
        }

        /* =======================================================
            2. PHÂN HỆ: QUẢN LÝ BÁC SĨ (DANH SÁCH, SỬA, XÓA)
           ======================================================= */
        [HttpGet("doctors")]
        public async Task<IActionResult> GetDoctors()
        {
            var doctors = await _context.Users
                .Where(u => u.Role.ToLower() == "doctor") // 🔥 ĐÃ SỬA: Lọc chữ thường an toàn
                .Select(u => new {
                    userId = u.UserId,   // 🔥 ĐÃ SỬA: Ép chữ thường khớp Angular
                    email = u.Email,     // 🔥 ĐÃ SỬA: Ép chữ thường khớp Angular
                    name = u.Doctor != null ? u.Doctor.FullName : "Chưa cập nhật tên",
                    phone = u.Doctor != null ? u.Doctor.Phone : "",
                    specialty = (u.Doctor != null && u.Doctor.Specialization != null)
                                ? u.Doctor.Specialization.Name
                                : "Đa khoa",
                    avatar = u.Doctor != null ? u.Doctor.Avatar : ""
                }).ToListAsync();

            return Ok(doctors);
        }

        [HttpPut("doctors/{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] System.Text.Json.JsonElement data)
        {
            var user = await _context.Users
                .Include(u => u.Doctor)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null) return NotFound(new { message = "Không tìm thấy bác sĩ!" });

            if (data.TryGetProperty("email", out var emailProp))
            {
                user.Email = emailProp.GetString();
                _context.Entry(user).State = EntityState.Modified;
            }

            if (user.Doctor != null)
            {
                if (data.TryGetProperty("name", out var nameProp))
                    user.Doctor.FullName = nameProp.GetString();

                if (data.TryGetProperty("phone", out var phoneProp))
                    user.Doctor.Phone = phoneProp.GetString();

                _context.Entry(user.Doctor).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Cập nhật thông tin bác sĩ thành công!" });
        }

        /* =======================================================
            3. PHÂN HỆ: QUẢN LÝ BỆNH NHÂN (DANH SÁCH, SỬA, XÓA)
           ======================================================= */
        [HttpGet("patients")]
        public async Task<IActionResult> GetPatients()
        {
            var patients = await _context.Users
                .Where(u => u.Role.ToLower() == "patient") // 🔥 ĐÃ SỬA: Lọc chữ thường an toàn
                .Select(u => new {
                    userId = u.UserId,   // 🔥 ĐÃ SỬA: Ép chữ thường khớp Angular
                    email = u.Email,     // 🔥 ĐÃ SỬA: Ép chữ thường khớp Angular
                    name = u.Patient != null ? u.Patient.FullName : "Ẩn danh",
                    phone = u.Patient != null ? u.Patient.Phone : "",
                    address = u.Patient != null ? u.Patient.Address : "",
                    avatar = u.Patient != null ? u.Patient.Avatar : ""
                }).ToListAsync();
            return Ok(patients);
        }

        [HttpPut("patients/{id}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] System.Text.Json.JsonElement data)
        {
            var user = await _context.Users.Include(u => u.Patient).FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null) return NotFound(new { message = "Không tìm thấy bệnh nhân!" });

            if (data.TryGetProperty("email", out var emailProp)) user.Email = emailProp.GetString();

            if (user.Patient != null)
            {
                if (data.TryGetProperty("name", out var nameProp)) user.Patient.FullName = nameProp.GetString();
                if (data.TryGetProperty("phone", out var phoneProp)) user.Patient.Phone = phoneProp.GetString();
                if (data.TryGetProperty("address", out var addrProp)) user.Patient.Address = addrProp.GetString();

                _context.Entry(user.Patient).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Cập nhật thông tin bệnh nhân thành công!" });
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { success = false, message = "Tài khoản không tồn tại!" });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Xóa tài khoản thành công!" });
        }

        /* =======================================================
            4. PHÂN HỆ: QUẢN LÝ LỊCH HẸN KHÁM
           ======================================================= */
        [HttpGet("appointments")]
        public async Task<IActionResult> GetAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Include(a => a.Schedule) // Đảm bảo đã có Include này
                .Include(a => a.Hospital)
                .Include(a => a.Specialization)
                .Where(a => a.BookingSource == "home")
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new {
                    appointmentId = a.AppointmentId,
                    patientName = a.Patient != null ? a.Patient.FullName : "Chưa rõ",
                    doctorName = a.Doctor != null ? a.Doctor.FullName : "Chưa phân công",
                    appointmentDate = a.AppointmentDate,

                    // 🔥 Tách riêng giờ bắt đầu và giờ kết thúc từ database
                    startTime = a.Schedule != null ? a.Schedule.StartTime.ToString(@"hh\:mm") : "00:00",
                    endTime = a.Schedule != null ? a.Schedule.EndTime.ToString(@"hh\:mm") : "00:00",
                    hospitalName = a.Hospital != null ? a.Hospital.Name : "Chưa chọn BV",
                    specializationName = a.Specialization != null ? a.Specialization.Name : "Chưa chọn khoa",

                    status = (int)a.Status
                })
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpDelete("appointments/{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound(new { success = false, message = "Lịch hẹn không tồn tại!" });

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Hủy bỏ và xóa lịch hẹn thành công!" });
        }

        [HttpPost("appointments/{id}/confirm")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound(new { success = false, message = "❌ Không tìm thấy lịch hẹn này!" });
            }

            // 🔥 SỬA TẠI ĐÂY: Gán trạng thái thông qua Enum AppointmentStatus
            appointment.Status = AppointmentStatus.Confirmed;

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "✅ Xác nhận lịch hẹn khám thành công!" });
        }
    }
}