using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health_booking_api.Models;
using health_booking_api.DTOs;

namespace health_booking_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly HealthBookingDbContext _context;

        public DoctorsController(HealthBookingDbContext context)
        {
            _context = context;
        }

        // GET: api/Doctors
        [HttpGet]
        public async Task<IActionResult> GetDoctors()
        {
            var doctors = await _context.Doctors
                .Include(d => d.Specialization)
                .Include(d => d.Hospital)
                .Include(d => d.User)
                .ToListAsync();
            return Ok(doctors);
        }

        // GET: api/Doctors/5
        [HttpGet("{id}")]
public async Task<IActionResult> GetDoctorById(int id)
{
    var doctor = await _context.Doctors
        .Include(d => d.Specialization)
        .Include(d => d.Hospital)
        .Include(d => d.User)
        .FirstOrDefaultAsync(d => d.DoctorId == id);

    if (doctor == null)
        return NotFound();

    return Ok(doctor);
}

// PUT: api/Doctors/5
[HttpPut("{id}")]
public async Task<IActionResult> UpdateDoctor(int id, [FromBody] DoctorUpdateDto dto)
{
    var doctor = await _context.Doctors.FindAsync(id);

    if (doctor == null)
        return NotFound();

    doctor.FullName         = dto.FullName;
    doctor.Phone            = dto.Phone;
    doctor.HospitalId       = dto.HospitalId;
    doctor.SpecializationId = dto.SpecializationId;
    doctor.ExperienceYears  = dto.ExperienceYears;
    doctor.Description      = dto.Description;

    await _context.SaveChangesAsync();

    return Ok(new { message = "Cập nhật thành công!" });
}

[HttpGet("dashboard/{userId}")]
public async Task<IActionResult> GetDashboard(int userId)
{
    var doctor = await _context.Doctors
        .Include(d => d.Specialization)
        .Include(d => d.Hospital)
        .FirstOrDefaultAsync(d => d.UserId == userId);

    if (doctor == null) return NotFound(new { message = "Không tìm thấy bác sĩ!" });

    var appointments = await _context.Appointments
        .Include(a => a.Patient)
        .Where(a => a.DoctorId == doctor.DoctorId)
        .OrderByDescending(a => a.AppointmentDate)
        .ToListAsync();

    var pending = appointments.Count(a => (int)a.Status == 0);
    var confirmed = appointments.Count(a => (int)a.Status == 1);
    var completed = appointments.Count(a => (int)a.Status == 2);
    var cancelled = appointments.Count(a => (int)a.Status == 3);

    return Ok(new
    {
        doctor = new
        {
            doctorId = doctor.DoctorId,
            fullName = doctor.FullName,
            avatar = doctor.Avatar,
            specialization = doctor.Specialization != null ? new { name = doctor.Specialization.Name } : null,
            hospital = doctor.Hospital != null ? new { name = doctor.Hospital.Name } : null,
            experienceYears = doctor.ExperienceYears
        },
        appointments = appointments.Select(a => new
        {
            appointmentId = a.AppointmentId,
            patient = a.Patient != null ? new { fullName = a.Patient.FullName } : null,
            appointmentDate = a.AppointmentDate,
            status = (int)a.Status
        }),
        total = appointments.Count,
        pending = pending,
        completed = completed,
        cancelled = cancelled
    });
}

[HttpPost("{id}/avatar")]
public async Task<IActionResult> UploadAvatar(int id, IFormFile avatarFile)
{
    if (avatarFile == null || avatarFile.Length == 0)
    {
        return BadRequest(new { success = false, message = "Không nhận được file ảnh" });
    }

    try
    {
        var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.DoctorId == id);
        if (doctor == null)
        {
            return NotFound(new { success = false, message = "Không tìm thấy bác sĩ" });
        }

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var fileName = "doctor_" + Guid.NewGuid().ToString().Substring(0, 8) + Path.GetExtension(avatarFile.FileName);
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await avatarFile.CopyToAsync(stream);
        }

        doctor.Avatar = $"/uploads/avatars/{fileName}";

        _context.Doctors.Update(doctor);
        await _context.SaveChangesAsync();

        // Trả về đường dẫn đầy đủ với đúng protocol và port của backend (https:7291)
        var fullAvatarUrl = $"https://localhost:7291{doctor.Avatar}";

        return Ok(new
        {
            success = true,
            message = "Upload avatar thành công!",
            avatarUrl = fullAvatarUrl
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { success = false, message = ex.Message });
    }
}
    }
}