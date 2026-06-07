using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace health_booking_api.Models
{
    public class DoctorSchedule
    {
        [Key]
        public int ScheduleId { get; set; }
        public int DoctorId { get; set; }
        [ForeignKey("DoctorId")]
        public virtual Doctor Doctor { get; set; }
        [DataType(DataType.Date)]
        public DateTime WorkDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int MaxPatients { get; set; }
        public int CurrentPatients { get; set; } = 0; // Tránh overbook lịch
    }
}
