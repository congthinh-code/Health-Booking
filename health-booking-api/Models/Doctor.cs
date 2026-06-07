using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace health_booking_api.Models
{
    public class Doctor
    {
        [Key]
        public int DoctorId { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [Required]
        public string FullName { get; set; }
        public string Phone { get; set; }
        public int ExperienceYears { get; set; }
        [Required]
        public string Description { get; set; }
        public string? Avatar { get; set; }

        public int SpecializationId { get; set; }
        [ForeignKey("SpecializationId")]
        public virtual Specialization Specialization { get; set; }

        public int HospitalId { get; set; }
        [ForeignKey("HospitalId")]
        public virtual Hospital Hospital { get; set; }

        public virtual ICollection<DoctorSchedule> Schedules { get; set; }
    }
}
