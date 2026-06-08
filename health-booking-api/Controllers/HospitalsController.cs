using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health_booking_api.Models;

namespace health_booking_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HospitalsController : ControllerBase
    {
        private readonly HealthBookingDbContext _context;

        public HospitalsController(HealthBookingDbContext context)
        {
            _context = context;
        }

        // GET: api/Hospitals
        [HttpGet]
        public async Task<IActionResult> GetHospitals()
        {
            var hospitals = await _context.Hospitals.ToListAsync();
            return Ok(hospitals);
        }
    }
}