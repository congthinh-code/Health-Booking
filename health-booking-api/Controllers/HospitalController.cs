using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health_booking_api.Models;

namespace health_booking_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HospitalController : ControllerBase
    {
        private readonly HealthBookingDbContext _context;

        public HospitalController(HealthBookingDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetHospitals()
        {
            try
            {
                // 1. Lấy dữ liệu thực tế từ bảng Hospitals trong Database
                var hospitals = await _context.Hospitals.ToListAsync();

                // 2. Nếu Database kết nối ngon lành nhưng bên trong chưa có dòng dữ liệu nào
                if (hospitals == null || hospitals.Count == 0)
                {
                    return Ok(new List<object> {
                        new {
                            name = "DB kết nối OK nhưng chưa có dữ liệu",
                            address = "Bạn hãy vào SQL Server thêm vài dòng vào bảng nha!"
                        }
                    });
                }

                return Ok(hospitals);
            }
            catch (Exception ex)
            {
                // 3. Nếu cấu hình Database bị lỗi (sai tên bảng, sai chuỗi kết nối...)
                return Ok(new List<object> {
                    new {
                        name = "LỖI KẾT NỐI DATABASE RỒI BẠN ƠI!",
                        address = $"Chi tiết lỗi: {ex.Message}"
                    }
                });
            }
        }
    }
}