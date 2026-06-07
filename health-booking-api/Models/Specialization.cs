using System.ComponentModel.DataAnnotations;
using System.Numerics;

namespace health_booking_api.Models
{
    public class Specialization
    {
        [Key]
        public int SpecializationId { get; set; }
        [Required]
        public string Name { get; set; }
        public virtual ICollection<Doctor> Doctors { get; set; }
    }
}
