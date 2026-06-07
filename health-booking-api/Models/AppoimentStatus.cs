namespace health_booking_api.Models
{
    public enum AppointmentStatus
    {
        Pending = 0,    // Chờ xác nhận
        Confirmed = 1,  // Đã xác nhận
        Completed = 2,  // Hoàn thành
        Cancelled = 3   // Đã hủy
    }
}
