namespace health_booking_api.DTOs
{
    public class DoctorUpdateDto
    {
        public string FullName         { get; set; }
        public string Phone            { get; set; }
        public int    HospitalId       { get; set; }
        public int    SpecializationId { get; set; }
        public int    ExperienceYears  { get; set; }
        public string Description      { get; set; }
    }
}