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
    }
}