using System.ComponentModel.DataAnnotations;
using System.Numerics;

namespace health_booking_api.Models
{
    public class Hospital
    {
        [Key]
        public int HospitalId { get; set; }
        [Required, StringLength(255)]
        public string Name { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public string Hotline { get; set; }
        public string Image { get; set; }
        public int Rating { get; set; }
        public string? WebsiteUrl { get; set; }
        public virtual ICollection<Doctor> Doctors { get; set; }
    }
}
