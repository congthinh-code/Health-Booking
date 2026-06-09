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
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đặt lịch khám thành công!" });
        }
    }
}
