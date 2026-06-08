using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health_booking_api.Models;

namespace health_booking_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpecializationsController : ControllerBase
    {
        private readonly HealthBookingDbContext _context;

        public SpecializationsController(HealthBookingDbContext context)
        {
            _context = context;
        }

        // GET: api/Specializations
        [HttpGet]
        public async Task<IActionResult> GetSpecializations()
        {
            var specializations = await _context.Specializations.ToListAsync();
            return Ok(specializations);
        }
    }
}