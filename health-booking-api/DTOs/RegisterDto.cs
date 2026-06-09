using System.ComponentModel.DataAnnotations;

namespace health_booking_api.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string HoTen { get; set; }
        [Required]
        public string NgaySinh { get; set; } // Định dạng DD/MM/YYYY
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public string? SoDienThoai { get; set; }
        public string? DiaChi { get; set; }
        [Required]
        public string MatKhau { get; set; }
        [Required]
        public string Role { get; set; } // "patient" hoặc "doctor"
    }
}