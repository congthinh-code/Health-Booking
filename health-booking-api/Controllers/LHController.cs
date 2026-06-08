using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health_booking_api.Models;

namespace health_booking_api.Controllers
{
    [ApiController]
    public class LHController : ControllerBase
    {
        private readonly HealthBookingDbContext _context;

        public LHController(HealthBookingDbContext context)
        {
            _context = context;
        }
        // 1. API lấy danh sách cơ sở y tế (Có phân trang) cho Angular
        [HttpGet("api/lh/csyt")]
        public async Task<IActionResult> GetHospitalsApi(int page = 1)
        {
            int pageSize = 4;

            int totalItems = await _context.Hospitals.CountAsync();
            int totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            var hospitals = await _context.Hospitals
                .OrderBy(x => x.HospitalId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Trả về một cục Object chứa đầy đủ cả dữ liệu lẫn thông tin phân trang để Angular xử lý
            return Ok(new
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = page,
                PageSize = pageSize,
                Data = hospitals
            });
        }

        // 2. API lấy danh sách quảng cáo (5 bệnh viện) cho Angular
        [HttpGet("api/lh/qc")]
        public async Task<IActionResult> GetHospitalsQcApi()
        {
            var hospitals = await _context.Hospitals
                .Take(5)
                .ToListAsync();

            return Ok(hospitals); // Trả về danh sách JSON gồm 5 bệnh viện
        }

        [HttpGet("api/lh/td")]
        public IActionResult GetTD()
        {
            var jobs = GetJobList();
            return Ok(jobs); // Trả về mảng JSON dữ liệu cho Angular
        }

        [HttpGet("api/lh/job-detail/{id}")]
        public IActionResult GetJobDetail(int id)
        {
            var jobs = GetJobList();
            var job = jobs.FirstOrDefault(j => j.Id == id);

            if (job == null)
            {
                return NotFound(new { message = "Thông tin tuyển dụng không tồn tại." });
            }

            return Ok(job); // Trả về đối tượng JSON công việc
        }

        private List<JobViewModel> GetJobList()
        {
            return new List<JobViewModel>
            {
                new JobViewModel { Id = 1, Title = "Phát Triển Kinh Doanh (B2B)", Type = "Full Time", Description = "Tìm kiếm và phát triển khách hàng doanh nghiệp." },
                new JobViewModel { Id = 2, Title = "Chuyên Viên Hành Chính Nhân Sự", Type = "Full Time", Description = "Quản lý hồ sơ nhân sự, tuyển dụng và hành chính văn phòng." },
                new JobViewModel { Id = 3, Title = "Kế Toán Viên Kiêm Chăm Sóc Khách Hàng", Type = "Full Time", Description = "Theo dõi công nợ, lập báo cáo và hỗ trợ khách hàng." },
                new JobViewModel { Id = 4, Title = "Thực Tập Sinh Content Marketing", Type = "Part Time", Description = "Hỗ trợ xây dựng nội dung cho website và mạng xã hội." },
                new JobViewModel { Id = 5, Title = "Giám Đốc Phát Triển Kinh Doanh - Dịch Vụ", Type = "Full Time", Description = "Xây dựng chiến lược kinh doanh và mở rộng thị trường." },
                new JobViewModel { Id = 6, Title = "Business Analyst", Type = "Full Time", Description = "Phân tích yêu cầu nghiệp vụ và đề xuất giải pháp." },
                new JobViewModel { Id = 7, Title = "Frontend ReactJS Developer", Type = "Full Time", Description = "Phát triển giao diện web bằng ReactJS." },
                new JobViewModel { Id = 8, Title = "Backend NodeJS Developer", Type = "Full Time", Description = "Xây dựng API và hệ thống backend bằng NodeJS." },
                new JobViewModel { Id = 9, Title = "Mobile App Developer (iOS/Android)", Type = "Full Time", Description = "Phát triển ứng dụng di động đa nền tảng." },
                new JobViewModel { Id = 10, Title = "Digital Marketing Specialist", Type = "Part Time", Description = "Thực hiện các chiến dịch quảng cáo và marketing." },
                new JobViewModel { Id = 11, Title = "Data Analyst Intern", Type = "Internship", Description = "Hỗ trợ phân tích dữ liệu và lập báo cáo." },
                new JobViewModel { Id = 12, Title = "UI/UX Designer", Type = "Full Time", Description = "Thiết kế giao diện và tối ưu trải nghiệm người dùng." },
                new JobViewModel { Id = 13, Title = "Product Manager", Type = "Full Time", Description = "Quản lý sản phẩm từ ý tưởng đến triển khai." },
                new JobViewModel { Id = 14, Title = "QA Engineer", Type = "Full Time", Description = "Kiểm thử phần mềm và đảm bảo chất lượng sản phẩm." },
                new JobViewModel { Id = 15, Title = "Senior Technical Writer", Type = "Part Time", Description = "Biên soạn tài liệu kỹ thuật và hướng dẫn sử dụng." },
                new JobViewModel { Id = 16, Title = "DevOps Engineer", Type = "Full Time", Description = "Quản lý CI/CD và hạ tầng hệ thống." },
                new JobViewModel { Id = 17, Title = "Graphics Designer Intern", Type = "Internship", Description = "Thiết kế hình ảnh cho website và marketing." }
            };
        }
    }
    public class JobViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
    }
}
