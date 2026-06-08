using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health_booking_api.Models;

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
    }
}