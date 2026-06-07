using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health_booking_api.Models;

namespace health_booking_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestDbController : ControllerBase
    {
        private readonly HealthBookingDbContext _context; // Thay MyDbContext bằng tên DbContext thật của bạn

        public TestDbController(HealthBookingDbContext context)
        {
            _context = context;
        }

        [HttpGet("check-connection")]
        public async Task<IActionResult> CheckConnection()
        {
            try
            {
                // Kiểm tra xem có thể kết nối tới server Database không
                var canConnect = await _context.Database.CanConnectAsync();

                if (canConnect)
                {
                    return Ok(new
                    {
                        status = "Thành công",
                        message = "Dự án .NET API đã kết nối tới Database ngon lành!"
                    });
                }

                return BadRequest(new
                {
                    status = "Thất bại",
                    message = "Không thể kết nối tới Database. Hãy kiểm tra lại SQL Server đã bật chưa."
                });
            }
            catch (Exception ex)
            {
                // Trả về chi tiết lỗi nếu Connection String hoặc cấu hình bị sai
                return StatusCode(500, new
                {
                    status = "Lỗi hệ thống",
                    message = ex.Message
                });
            }
        }
    }
}
