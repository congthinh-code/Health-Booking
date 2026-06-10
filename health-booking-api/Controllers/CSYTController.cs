using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health_booking_api.Models; 

namespace health_booking_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CSYTController : ControllerBase
    {
        private readonly HealthBookingDbContext _context;

        public CSYTController(HealthBookingDbContext context)
        {
            _context = context;
        }

        // API Bệnh viện công: api/csyt/BVCong
        [HttpGet("BVCong")]
        public async Task<IActionResult> GetBVCong()
        {
            try
            {
                // Giữ nguyên logic lọc từ DB cũ của bạn
                var dsBenhVien = await _context.Hospitals
                    .Where(h => h.Description == "Bệnh viện công")
                    .ToListAsync();

                return Ok(dsBenhVien); // Trả về JSON sạch
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // API Bệnh viện tư: api/csyt/BVTu
        [HttpGet("BVTu")]
        public async Task<IActionResult> GetBVTu()
        {
            try
            {
                // Giữ nguyên logic lọc từ DB cũ của bạn
                var dsBenhVien = await _context.Hospitals
                    .Where(h => h.Description == "Bệnh viện tư")
                    .ToListAsync();

                return Ok(dsBenhVien); // Trả về JSON sạch
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("GetBookingFormData")]
        public async Task<IActionResult> GetBookingFormData()
        {
            // Thay thế cho BookingViewModel bên MVC, trả về cả 2 danh sách để Angular map vào Dropdown
            var hospitals = await _context.Hospitals.OrderBy(h => h.Name).Select(h => new { h.HospitalId, h.Name }).ToListAsync();
            var specializations = await _context.Specializations.OrderBy(s => s.Name).Select(s => new { s.SpecializationId, s.Name }).ToListAsync();

            return Ok(new { hospitals, specializations });
        }
    }
}