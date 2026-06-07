using System.ComponentModel.DataAnnotations;
using System.Numerics;

namespace health_booking_api.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public string Role { get; set; } // Admin, Doctor, Patient
        public DateTime CreatedAt { get; set; }

        public virtual Patient Patient { get; set; }
        public virtual Doctor Doctor { get; set; }
    }
}
