using health_booking_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace health_booking_api.Controllers
{
    [ApiController] // Thêm dòng này để C# biết đây là API
    [Route("api/[controller]")] // Đường dẫn gọi sẽ là: api/Search
    public class SearchController : ControllerBase // Đổi từ Controller sang ControllerBase
    {
        private readonly HealthBookingDbContext _context;

        public SearchController(HealthBookingDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetSearch")]
        public async Task<IActionResult> GetSearch([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return Ok(new List<object>());

            // 1. Chuyển từ khóa tìm kiếm về chữ thường và cắt khoảng trắng thừa
            string keyword = q.Trim().ToLower();

            // 2. Tìm kiếm Bác sĩ (Ưu tiên ép về ToLower)
            var doctors = await _context.Doctors
                .Include(d => d.Specialization)
                .Include(d => d.Hospital)
                .Where(d =>
                    d.FullName.ToLower().Contains(keyword) ||
                    (d.Description != null && d.Description.ToLower().Contains(keyword)) ||
                    (d.Specialization != null && d.Specialization.Name.ToLower().Contains(keyword)) ||
                    (d.Hospital != null && d.Hospital.Name.ToLower().Contains(keyword))
                )
                .Select(d => new
                {
                    type = "doctor",
                    id = d.DoctorId,
                    title = d.FullName,
                    subtitle = d.Specialization != null ? d.Specialization.Name : "Bác sĩ",
                    url = "/DVYT/ĐKBS?id=" + d.DoctorId
                })
                .Take(5)
                .ToListAsync();

            // 3. Tìm kiếm Bệnh viện (Ép về ToLower)
            var hospitals = await _context.Hospitals
                .Where(h =>
                    h.Name.ToLower().Contains(keyword) ||
                    (h.Address != null && h.Address.ToLower().Contains(keyword))
                )
                .Select(h => new
                {
                    type = "hospital",
                    id = h.HospitalId,
                    title = h.Name,
                    subtitle = h.Address,
                    url = "/DVYT/ĐKCS?hospitalId=" + h.HospitalId
                })
                .Take(5)
                .ToListAsync();

            // 4. Tìm kiếm Chuyên khoa (Ép về ToLower)
            var specializations = await _context.Specializations
                .Where(s => s.Name.ToLower().Contains(keyword))
                .Select(s => new
                {
                    type = "specialization",
                    id = s.SpecializationId,
                    title = s.Name,
                    subtitle = "Chuyên khoa",
                    url = "/DVYT/ĐKCK?specializationId=" + s.SpecializationId
                })
                .Take(5)
                .ToListAsync();

            // Gộp kết quả trả về
            var results = new List<object>();
            results.AddRange(doctors);
            results.AddRange(hospitals);
            results.AddRange(specializations);

            return Ok(results);
        }
    }
}