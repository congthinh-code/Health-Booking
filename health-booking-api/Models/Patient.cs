using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace health_booking_api.Models
{
    public class Patient
    {
        [Key]
        public int PatientId { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [Required]
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; } // Tuổi sẽ được tính từ đây, không lưu cột tuổi
        public string Gender { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string? Avatar { get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; }
    }
}
