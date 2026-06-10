using health_booking_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

// Sửa lại đúng Namespace theo cấu trúc thư mục dự án API của bạn (nhìn từ ảnh Solution Explorer)
namespace health_booking_api.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class BookingController : ControllerBase
    {
        private readonly HealthBookingDbContext _context;
        // Tạm thời ẩn NotificationService nếu bạn chưa cấu hình SignalR/Chuông trên dự án API độc lập này
        // private readonly NotificationService _notificationService;

        public BookingController(HealthBookingDbContext context)
        {
            _context = context;
        }

        // Lớp nhận dữ liệu DTO đồng bộ hoàn hảo với JSON từ Angular gửi sang
        public class BookingRequestDto
        {
            public int UserId { get; set; }
            public string PatientName { get; set; } = string.Empty;
            public string Phone { get; set; } = string.Empty;
            public string? HospitalId { get; set; }
            public string? SpecializationId { get; set; }
            public string? DoctorUserId { get; set; }
            public string AppointmentDate { get; set; } = string.Empty;
            public string AppointmentTime { get; set; } = string.Empty;
        }
        [HttpPost]
        public async Task<IActionResult> ProcessBooking([FromBody] BookingRequestDto model)
        {
            if (model == null)
            {
                return Ok(new { success = false, message = "Dữ liệu gửi lên không hợp lệ." });
            }

            // 1. Nhận UserId thực tế từ Angular truyền sang (Khi bạn của bạn làm xong Login, FE sẽ tự động gửi ID này lên)
            if (model.UserId <= 0)
            {
                return Ok(new { success = false, message = "Lỗi hệ thống: Không xác định được tài khoản đang thao tác (UserId trống)." });
            }

            // 2. Tìm chính xác hồ sơ bệnh nhân trong DB dựa vào UserId của người đang đăng nhập
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == model.UserId);
            if (patient == null)
            {
                return Ok(new { success = false, message = "Tài khoản của bạn chưa tạo hồ sơ bệnh nhân. Vui lòng cập nhật hồ sơ trước khi đặt lịch!" });
            }

            // 3. Logic linh hoạt: Nếu trên form Đặt khám nhanh người dùng nhập Tên/SĐT mới thì lấy theo Form, 
            // nếu để trống thì tự động lấy thông tin mặc định từ Profile gốc của họ (Bạn bạn đang làm)
            string finalPatientName = string.IsNullOrEmpty(model.PatientName) ? patient.FullName : model.PatientName;
            string finalPhone = string.IsNullOrEmpty(model.Phone) ? patient.Phone : model.Phone;

            // 4. Kiểm tra dữ liệu trống cơ bản
            if (string.IsNullOrEmpty(finalPatientName) || string.IsNullOrEmpty(finalPhone) || string.IsNullOrEmpty(model.AppointmentDate) || string.IsNullOrEmpty(model.AppointmentTime))
            {
                return Ok(new { success = false, message = "Vui lòng điền đầy đủ thông tin họ tên, số điện thoại, ngày và giờ khám!" });
            }

            //Đoạn này test đăng nhập

            //[HttpPost]
            //public async Task<IActionResult> ProcessBooking([FromBody] BookingRequestDto model)
            //{
            //    if (model == null)
            //    {
            //        return Ok(new { success = false, message = "Dữ liệu gửi lên không hợp lệ hoặc trống." });
            //    }

            //    // Do chạy môi trường API tách biệt, gán UserId mặc định là tài khoản đang test nếu FE chưa truyền qua
            //    int currentUserId = model.UserId > 0 ? model.UserId : 1;

            //    // Tìm hồ sơ bệnh nhân trong DB dựa vào UserId
            //    // 1. Tìm hồ sơ bệnh nhân trong DB dựa vào UserId gửi từ FE lên
            //    var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == currentUserId);

            //    // 2. NẾU KHÔNG TÌM THẤY (do Angular chưa có chức năng login nên UserId bị lệch):
            //    if (patient == null)
            //    {
            //        // Bốc đại ông bệnh nhân đầu tiên đang nằm sẵn trong Database cũ để lấy ID test form
            //        patient = await _context.Patients.FirstOrDefaultAsync();
            //    }

            //    // 3. Trường hợp hy hữu nếu DB cũ bị xóa sạch bảng Patients:
            //    if (patient == null)
            //    {
            //        return Ok(new { success = false, message = "Bảng Patients trong DB cũ đang trống rỗng. Hãy mở SQL Server lên kiểm tra dữ liệu nhé!" });
            //    }

            //    // Điền dữ liệu từ profile nếu trên form đặt lịch nhanh người dùng để trống
            //    string finalPatientName = string.IsNullOrEmpty(model.PatientName) ? patient.FullName : model.PatientName;
            //    string finalPhone = string.IsNullOrEmpty(model.Phone) ? patient.Phone : model.Phone;

            //    // 2. Kiểm tra dữ liệu trống cơ bản
            //    if (string.IsNullOrEmpty(finalPatientName) || string.IsNullOrEmpty(finalPhone) || string.IsNullOrEmpty(model.AppointmentDate) || string.IsNullOrEmpty(model.AppointmentTime))
            //    {
            //        return Ok(new { success = false, message = "Vui lòng điền đầy đủ thông tin họ tên, số điện thoại, ngày và giờ khám!" });
            //    }

            // 3. Kiểm tra tính hợp lệ của định dạng Số điện thoại
            if (!Regex.IsMatch(finalPhone, @"^[0-9]{10,11}$"))
            {
                return Ok(new { success = false, message = "Số điện thoại nhập vào không đúng định dạng (phải từ 10-11 chữ số)." });
            }

            // 4. Kiểm tra ngày giờ hẹn khám có hợp lệ và nằm ở tương lai hay không
            DateTime appointmentDateTime;
            if (DateTime.TryParse($"{model.AppointmentDate} {model.AppointmentTime}", out appointmentDateTime))
            {
                if (appointmentDateTime < DateTime.Now)
                {
                    return Ok(new { success = false, message = "Thời gian đặt lịch khám không được chọn ở quá khứ!" });
                }
            }
            else
            {
                return Ok(new { success = false, message = "Định dạng ngày hoặc giờ đặt khám không hợp lệ." });
            }

            try
            {
                // Xử lý chuyển đổi an toàn (Safe Parse) từ chuỗi Id ở FE sang kiểu dữ liệu số int? ở DB
                int? targetHospitalId = !string.IsNullOrEmpty(model.HospitalId) ? int.Parse(model.HospitalId) : null;
                int? targetSpecializationId = !string.IsNullOrEmpty(model.SpecializationId) ? int.Parse(model.SpecializationId) : null;
                int? targetDoctorUserId = !string.IsNullOrEmpty(model.DoctorUserId) ? int.Parse(model.DoctorUserId) : null;

                int? targetDoctorId = null;

                if (targetDoctorUserId.HasValue)
                {
                    var doctorSelected = await _context.Doctors
                        .FirstOrDefaultAsync(d => d.UserId == targetDoctorUserId.Value);
                    if (doctorSelected != null)
                    {
                        targetDoctorId = doctorSelected.DoctorId;
                    }
                }

                // 5. Khởi tạo đối tượng Appointment mới khớp chuẩn xác với các trường dữ liệu trong Model của bạn
                var newAppointment = new Appointment
                {
                    PatientId = patient.PatientId,
                    DoctorId = targetDoctorId ?? 1, // Gán mặc định bác sĩ trực là 1 nếu đặt lịch nhanh theo cơ sở/chuyên khoa
                    ScheduleId = 1,                 // Gán giá trị mặc định tránh lỗi khóa ngoại hoặc thuộc tính ràng buộc
                    HospitalId = targetHospitalId,
                    SpecializationId = targetSpecializationId,
                    AppointmentDate = appointmentDateTime,

                    // Nếu trường Status của bạn dùng kiểu Enum, hãy gán giá trị tương ứng (ví dụ: 0 hoặc AppointmentStatus.Pending)
                    // Ở đây gán tạm giá trị số nguyên hoặc trạng thái chờ duyệt tùy cấu trúc DB của bạn
                    Status = 0,
                    CreatedAt = DateTime.Now,
                    BookingSource = "Home"
                };

                // Thêm vào DbSet và thực thi lưu xuống Database SQL Server/MySQL
                _context.Appointments.Add(newAppointment);

                var doctorSelected2 = await _context.Doctors.FindAsync(targetDoctorId ?? 1);
                if (doctorSelected2 != null)
                {
                    var notification = new Notification
                    {
                        UserId = doctorSelected2.UserId,
                        Message = $"Bạn có một lịch khám mới chờ xác nhận từ bệnh nhân {finalPatientName} vào ngày {appointmentDateTime:dd/MM/yyyy HH:mm}.",
                        CreatedAt = DateTime.Now,
                        IsRead = false
                    };
                    _context.Notifications.Add(notification);
                }

                var patientNotification = new Notification
                {
                    UserId = model.UserId,
                    Message = $"✅ Bạn đã đặt lịch khám với bác sĩ thành công vào lúc {appointmentDateTime:HH\\:mm} ngày {appointmentDateTime:dd/MM/yyyy}. Vui lòng chờ bác sĩ xác nhận.",
                    CreatedAt = DateTime.Now,
                    IsRead = false
                };
                _context.Notifications.Add(patientNotification);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Đặt lịch khám thành công! Thông tin đăng ký lịch hẹn của bạn đã được hệ thống ghi nhận.",
                    appointment_id = newAppointment.AppointmentId
                });
            }
            catch (Exception ex)
            {
                // Bóc tách lỗi từ lớp trong cùng (InnerException) giúp bạn dễ debug lỗi DB nếu gán sai trường dữ liệu
                var innerMsg = ex.InnerException != null ? " | Chi tiết lỗi hệ thống: " + ex.InnerException.Message : "";
                return Ok(new { success = false, message = "Đã xảy ra lỗi khi lưu vào cơ sở dữ liệu: " + ex.Message + innerMsg });
            }
        }
    }
}