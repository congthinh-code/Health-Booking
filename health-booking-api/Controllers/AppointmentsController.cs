using health_booking_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace health_booking_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly HealthBookingDbContext _context;

        public AppointmentsController(HealthBookingDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 🔔 THÊM MỚI: API XÁC NHẬN LỊCH KHÁM (POST: api/Appointments/{id}/confirm)
        // ==========================================
        [HttpPost("{id}/confirm")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy lịch hẹn!" });
            }

            // Cập nhật trạng thái thành Đã xác nhận (Thường tương đương với giá trị enum hoặc số 1)
            appointment.Status = AppointmentStatus.Confirmed; // Hoặc bằng 1 tùy theo cách bạn định nghĩa Enum

            _context.Appointments.Update(appointment);

            var patient = await _context.Patients.FindAsync(appointment.PatientId);
            if (patient != null)
            {
                var notification = new Notification
                {
                    UserId = patient.UserId,
                    Message = $"Lịch hẹn khám ngày {appointment.AppointmentDate:dd/MM/yyyy HH:mm} của bạn đã được bác sĩ xác nhận.",
                    CreatedAt = DateTime.Now,
                    IsRead = false
                };
                _context.Notifications.Add(notification);
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Xác nhận lịch khám thành công!" });
        }

        // ==========================================
        // 🔔 THÊM MỚI: API TỪ CHỐI / HỦY LỊCH KHÁM (POST: api/Appointments/{id}/reject)
        // ==========================================
        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectAppointment(int id, [FromBody] Dictionary<string, string> payload)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy lịch hẹn!" });
            }

            // Cập nhật trạng thái thành Đã hủy (Thường tương đương với giá trị enum hoặc số 3)
            appointment.Status = AppointmentStatus.Cancelled; // Hoặc bằng 3 tùy theo cách bạn định nghĩa Enum

            // Nếu bảng Appointment của bạn có cột lưu lý do hủy, bạn có thể bỏ comment dòng dưới để lưu:
            // if (payload.ContainsKey("reason")) { appointment.CancelReason = payload["reason"]; }

            _context.Appointments.Update(appointment);

            var patient = await _context.Patients.FindAsync(appointment.PatientId);
            if (patient != null)
            {
                string reason = payload != null && payload.ContainsKey("reason") ? payload["reason"] : "";
                string msg = $"Lịch hẹn khám ngày {appointment.AppointmentDate:dd/MM/yyyy HH:mm} của bạn đã bị từ chối.";
                if (!string.IsNullOrEmpty(reason))
                {
                    msg += $" Lý do: {reason}";
                }
                var notification = new Notification
                {
                    UserId = patient.UserId,
                    Message = msg,
                    CreatedAt = DateTime.Now,
                    IsRead = false
                };
                _context.Notifications.Add(notification);
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đã từ chối và hủy lịch khám thành công!" });
        }


        // ==========================================
        // ⚙️ API ĐẶT LỊCH KHÁM BỆNH NHÂN (GIỮ NGUYÊN CODE CŨ CỦA BẠN)
        // ==========================================
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromForm] string? userId,
            [FromForm] string? doctorId,
            [FromForm] string? hospitalId,
            [FromForm] string? date,
            [FromForm] string? time,
            [FromForm] string? specialty,
            [FromForm] string? patientName,
            [FromForm] string? patientCode,
            [FromForm] string? amount,
            [FromForm] string? method)
        {
            if (!string.IsNullOrWhiteSpace(method) && !string.IsNullOrWhiteSpace(amount))
            {
                return Ok(new
                {
                    success = true,
                    message = $"Đã ghi nhận thanh toán {amount} VNĐ qua {method}."
                });
            }

            if (string.IsNullOrWhiteSpace(userId) || !int.TryParse(userId, out int uid))
            {
                return BadRequest(new { success = false, message = "Vui lòng đăng nhập để đặt khám!" });
            }

            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == uid);
            if (patient == null)
            {
                return BadRequest(new { success = false, message = "Không tìm thấy hồ sơ bệnh nhân!" });
            }

            if (string.IsNullOrWhiteSpace(date) || string.IsNullOrWhiteSpace(time))
            {
                return BadRequest(new { success = false, message = "Vui lòng chọn ngày và giờ khám!" });
            }

            if (!DateTime.TryParse(date, out var appointmentDate))
            {
                return BadRequest(new { success = false, message = "Ngày khám không hợp lệ!" });
            }

            if (TimeSpan.TryParse(time, out var timeSpan))
            {
                appointmentDate = appointmentDate.Date.Add(timeSpan);
            }

            int resolvedDoctorId = 1;
            if (!string.IsNullOrWhiteSpace(doctorId) && int.TryParse(doctorId, out int parsedDoctorId))
            {
                resolvedDoctorId = parsedDoctorId;
            }
            else if (!string.IsNullOrWhiteSpace(hospitalId) && int.TryParse(hospitalId, out int parsedHospitalId))
            {
                var hospitalDoctor = await _context.Doctors
                    .FirstOrDefaultAsync(d => d.HospitalId == parsedHospitalId);
                if (hospitalDoctor != null)
                {
                    resolvedDoctorId = hospitalDoctor.DoctorId;
                }
            }

            var schedule = await _context.DoctorSchedules
                .FirstOrDefaultAsync(s => s.DoctorId == resolvedDoctorId && s.WorkDate.Date == appointmentDate.Date);

            var appointment = new Appointment
            {
                PatientId = patient.PatientId,
                DoctorId = resolvedDoctorId,
                ScheduleId = schedule?.ScheduleId ?? 1,
                AppointmentDate = appointmentDate,
                Status = AppointmentStatus.Pending,
                CreatedAt = DateTime.Now,
                BookingSource = !string.IsNullOrWhiteSpace(doctorId) ? "Doctor" : "Hospital",
                HospitalId = int.TryParse(hospitalId, out int hospitalIdValue) ? hospitalIdValue : null
            };

            _context.Appointments.Add(appointment);

            var doctor = await _context.Doctors.FindAsync(resolvedDoctorId);
            if (doctor != null)
            {
                var notification = new Notification
                {
                    UserId = doctor.UserId,
                    Message = $"Bạn có một lịch khám mới chờ xác nhận từ bệnh nhân {patient.FullName} vào ngày {appointmentDate:dd/MM/yyyy HH:mm}.",
                    CreatedAt = DateTime.Now,
                    IsRead = false
                };
                _context.Notifications.Add(notification);
            }

            var patientNotification = new Notification
            {
                UserId = uid,
                Message = $"✅ Bạn đã đặt lịch khám với bác sĩ thành công vào lúc {appointmentDate:HH\\:mm} ngày {appointmentDate:dd/MM/yyyy}. Vui lòng chờ bác sĩ xác nhận.",
                CreatedAt = DateTime.Now,
                IsRead = false
            };
            _context.Notifications.Add(patientNotification);

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đặt lịch khám thành công!" });
        }
    }
}