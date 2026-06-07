using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using System;

namespace health_booking_api.Models
{
    public class HealthBookingDbContext : DbContext
    {
        public HealthBookingDbContext(DbContextOptions<HealthBookingDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Hospital> Hospitals { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<DoctorSchedule> DoctorSchedules { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Ràng buộc quan hệ 1-1
            modelBuilder.Entity<User>().HasOne(u => u.Patient).WithOne(p => p.User).HasForeignKey<Patient>(p => p.UserId);
            modelBuilder.Entity<User>().HasOne(u => u.Doctor).WithOne(d => d.User).HasForeignKey<Doctor>(d => d.UserId);

            // ================= FIX LỖI CASCADE CYCLES =================
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany()
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // ================= SEED DATA =================
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserId = 1,
                    Email = "admin@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Admin",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 2,
                    Email = "ngotrungnam@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 3,
                    Email = "nguyenthithanhminh@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 4,
                    Email = "nguyenphucthien@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 5,
                    Email = "dodangkhoa@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 6,
                    Email = "levutan@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 7,
                    Email = "baduykhuong@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 8,
                    Email = "nguyenvanhoa@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 9,
                    Email = "lethilan@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 10,
                    Email = "nguyenhuuphong@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 11,
                    Email = "tranduchuy@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 12,
                    Email = "dominhquan@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 13,
                    Email = "vongocthanh@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 14,
                    Email = "nguyentanphat@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 15,
                    Email = "tranhongnhung@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 16,
                    Email = "phamminhquan@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 17,
                    Email = "vuthingoc@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 18,
                    Email = "nguyenhuudung@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 19,
                    Email = "tranthithuhang@healthbooking.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Doctor",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 20,
                    Email = "patienta@gmail.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Patient",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    UserId = 21,
                    Email = "patientb@gmail.com",
                    Password = "$2a$11$.IaAh9ncKKq/7u608sBTKOIEUTv2hWuEy/AVXnLttucniyNC1rKtC",
                    Role = "Patient",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            modelBuilder.Entity<Hospital>().HasData(
                new Hospital
                {
                    HospitalId = 1,
                    Name = "Bệnh viện đa khoa tỉnh Bình Định",
                    Address = "106 Nguyễn Huệ, Phường Quy Nhơn, Tỉnh Gia Lai",
                    Description = "Bệnh viện công",
                    Hotline = "056 3820 289",
                    Image = "images/anhbenhvien/bvdk.jpg",
                    WebsiteUrl = "https://benhvienbinhdinh.com.vn/"
                },
                new Hospital
                {
                    HospitalId = 2,
                    Name = "Bệnh viện Mắt Bình Định",
                    Address = "78 Trần Hưng Đạo, Quy Nhơn, Gia Lai",
                    Description = "Bệnh viện công",
                    Hotline = "0256 3893 247",
                    Image = "images/anhbenhvien/bvmat.jpg",
                    WebsiteUrl = "https://www.bvmatbinhdinh.vn/"
                },
                new Hospital
                {
                    HospitalId = 3,
                    Name = "Trung tâm Y tế Quy Nhơn",
                    Address = "114 Trần Hưng Đạo, phường Quy Nhơn, tỉnh Gia Lai",
                    Description = "Bệnh viện công",
                    Hotline = "0269 6566 366",
                    Image = "images/anhbenhvien/bvquynhon.jpg",
                    WebsiteUrl= "https://benhvienquynhon.gov.vn/"
                },
                new Hospital
                {
                    HospitalId = 4,
                    Name = "Bệnh viện Y học cổ truyền & PHCN Bình Định",
                    Address = "Tổ 05, KV05, Phường Quy Nhơn Bắc, tỉnh Gia Lai",
                    Description = "Bệnh viện công",
                    Hotline = "0965 071 919",
                    Image = "images/anhbenhvien/yhoccotruyen.jpg",
                    WebsiteUrl= "https://yhctphcnquynhon.vn/"
                },
                new Hospital
                {
                    HospitalId = 5,
                    Name = "Bệnh viện Phong - Da liễu Trung ương Quy Hoà",
                    Address = "05A Đường Chế Lan Viên, Quy Nhơn Nam, Gia Lai",
                    Description = "Bệnh viện công",
                    Hotline = "0256 3532 536",
                    Image = "images/anhbenhvien/bvquyhoa.jpg",
                    WebsiteUrl= "https://bvquyhoa.vn/"
                },
                new Hospital
                {
                    HospitalId = 6,
                    Name = "Bệnh viện đa khoa Hoà Bình",
                    Address = "355 Trần Hưng Đạo, Phường Quy Nhơn, Gia Lai",
                    Description = "Bệnh viện tư",
                    Hotline = "0256 3822 900",
                    Image = "images/anhbenhvien/bvhoabinh.jpg",
                    WebsiteUrl= "https://hoabinhhospital.com.vn/"
                },
                new Hospital
                {
                    HospitalId = 7,
                    Name = "Trung tâm Y tế huyện Tuy Phước",
                    Address = "66 Đào Tấn, Xã Tuy Phước, Gia Lai",
                    Description = "Bệnh viện công",
                    Hotline = "0256 3833 315",
                    Image = "images/anhbenhvien/bvtuyphuoc.jpg",
                    WebsiteUrl= "https://ttyttuyphuoc.com.vn/"
                },
                new Hospital
                {
                    HospitalId = 8,
                    Name = "Bệnh viện Quân y 13",
                    Address = "54 An Dương Vương, Phường Quy Nhơn Nam, Gia Lai",
                    Description = "Bệnh viện công",
                    Hotline = "0256 3846 363",
                    Image = "images/anhbenhvien/quany13.jpg",
                    WebsiteUrl= "https://benhvienquany13.vn/"
                },
                new Hospital
                {
                    HospitalId = 9,
                    Name = "Bệnh viện đa khoa Thu Phúc",
                    Address = "420 Nguyễn Thái Học, Quy Nhơn Nam, Gia Lai",
                    Description = "Bệnh viện tư",
                    Hotline = "0256 3686 115",
                    Image = "images/anhbenhvien/dktp.jpg",
                    WebsiteUrl= "https://thuphuc.vn/"
                }
            );

            modelBuilder.Entity<Specialization>().HasData(
                new Specialization { SpecializationId = 1, Name = "Bác sĩ gia đình" },
                new Specialization { SpecializationId = 2, Name = "Tiêu hoá gan mật" },
                new Specialization { SpecializationId = 3, Name = "Nội tổng quát" },
                new Specialization { SpecializationId = 4, Name = "Nội tiết" },
                new Specialization { SpecializationId = 5, Name = "Da liễu" },
                new Specialization { SpecializationId = 6, Name = "Nội tim mạch" },
                new Specialization { SpecializationId = 7, Name = "Nội thần kinh" },
                new Specialization { SpecializationId = 8, Name = "Nội cơ xương khớp" },
                new Specialization { SpecializationId = 9, Name = "Tai mũi họng" },
                new Specialization { SpecializationId = 10, Name = "Mắt" },
                new Specialization { SpecializationId = 11, Name = "Nội tiêu hoá" },
                new Specialization { SpecializationId = 12, Name = "Nội hô hấp" },
                new Specialization { SpecializationId = 13, Name = "Nội tiết niệu" },
                new Specialization { SpecializationId = 14, Name = "Ngoại cơ xương khớp" },
                new Specialization { SpecializationId = 15, Name = "Sản - Phụ khoa" }
            );

            modelBuilder.Entity<Doctor>().HasData(
                new Doctor 
                { 
                    DoctorId = 1, 
                    UserId = 2, 
                    FullName = "BS CKII. Ngô Trung Nam", 
                    Phone = "0901 234 501", 
                    ExperienceYears = 10, 
                    Description = "Chuyên khoa Tim Mạch", 
                    SpecializationId = 6, 
                    HospitalId = 1, 
                    Avatar = "anhbs3.jpg" 
                },
                new Doctor { DoctorId = 2, UserId = 3, FullName = "BS CKI. Nguyễn Thị Thanh Minh", Phone = "0901 234 502", ExperienceYears = 5, Description = "Chuyên khoa Tim mạch", SpecializationId = 6, HospitalId = 3, Avatar = "anhbs1.jpg" },
                new Doctor { DoctorId = 3, UserId = 4, FullName = "BS CKI. Nguyễn Phúc Thiện", Phone = "0901 234 503", ExperienceYears = 8, Description = "Chuyên khoa Tai Mũi Họng", SpecializationId = 9, HospitalId = 2, Avatar = "anhbs5.jpg" },
                new Doctor { DoctorId = 4, UserId = 5, FullName = "BS CKI. Đỗ Đăng Khoa", Phone = "0901 234 504", ExperienceYears = 7, Description = "Chuyên khoa Sản - Phụ khoa", SpecializationId = 15, HospitalId = 1, Avatar = "anhbs6.jpg" },
                new Doctor { DoctorId = 5, UserId = 6, FullName = "ThS BS. Lê Vũ Tân", Phone = "0901 234 505", ExperienceYears = 10, Description = "Chuyên khoa Da liễu", SpecializationId = 5, HospitalId = 5, Avatar = "anhbs7.jpg" },
                new Doctor { DoctorId = 6, UserId = 7, FullName = "BS CKI. Bá Duy Khương", Phone = "0901 234 506", ExperienceYears = 9, Description = "Chuyên khoa Tai Mũi Họng", SpecializationId = 9, HospitalId = 9, Avatar = "anhbs8.jpg" },
                new Doctor { DoctorId = 7, UserId = 8, FullName = "PGS TS. Nguyễn Văn Hoà", Phone = "0901 234 507", ExperienceYears = 12, Description = "Chuyên khoa Thần Kinh", SpecializationId = 7, HospitalId = 6, Avatar = "anhbs10.jpg" },
                new Doctor { DoctorId = 8, UserId = 9, FullName = "BS CKII. Lê Thị Lan", Phone = "0901 234 508", ExperienceYears = 15, Description = "Chuyên khoa Da liễu", SpecializationId = 5, HospitalId = 5, Avatar = "anhbs9.jpg" },
                new Doctor { DoctorId = 9, UserId = 10, FullName = "ThS BS. Nguyễn Hữu Phong", Phone = "0901 234 509", ExperienceYears = 7, Description = "Chuyên khoa Tim mạch", SpecializationId = 6, HospitalId = 7, Avatar = "anhbs11.jpg" },
                new Doctor { DoctorId = 10, UserId = 11, FullName = "BS CKI. Trần Đức Huy", Phone = "0901 234 510", ExperienceYears = 20, Description = "Chuyên khoa Nội tiết niệu", SpecializationId = 13, HospitalId = 3, Avatar = "anhbs12.jpg" },
                new Doctor { DoctorId = 11, UserId = 12, FullName = "ThS BS. Đỗ Minh Quân", Phone = "0901 234 511", ExperienceYears = 15, Description = "Chuyên khoa Ngoại cơ xương khớp", SpecializationId = 14, HospitalId = 1, Avatar = "anhbs13.jpg" },
                new Doctor { DoctorId = 12, UserId = 13, FullName = "BS CKII. Võ Ngọc Thanh", Phone = "0901 234 512", ExperienceYears = 10, Description = "Chuyên khoa Sản", SpecializationId = 15, HospitalId = 6, Avatar = "anhbs2.jpg" },
                new Doctor { DoctorId = 13, UserId = 14, FullName = "BS CKI. Nguyễn Tấn Phát", Phone = "0901 234 513", ExperienceYears = 10, Description = "Chuyên khoa Nội hô hấp", SpecializationId = 12, HospitalId = 8, Avatar = "anhbs14.jpg" },
                new Doctor { DoctorId = 14, UserId = 15, FullName = "BS CKII. Trần Hồng Nhung", Phone = "0901 234 514", ExperienceYears = 8, Description = "Chuyên khoa Mắt", SpecializationId = 10, HospitalId = 5, Avatar = "anhbs4.jpg" },
                new Doctor { DoctorId = 15, UserId = 16, FullName = "ThS BS. Phạm Minh Quân", Phone = "0901 234 515", ExperienceYears = 15, Description = "Chuyên khoa Tai Mũi Họng", SpecializationId = 9, HospitalId = 6, Avatar = "anhbs15.jpg" },
                new Doctor { DoctorId = 16, UserId = 17, FullName = "BS CKI. Võ Thị Ngọc", Phone = "0901 234 516", ExperienceYears = 10, Description = "Chuyên khoa Da liễu", SpecializationId = 5, HospitalId = 5, Avatar = "anhbs2.jpg" },
                new Doctor { DoctorId = 17, UserId = 18, FullName = "ThS BS. Nguyễn Hữu Dũng", Phone = "0901 234 517", ExperienceYears = 15, Description = "Chuyên khoa Tim mạch", SpecializationId = 6, HospitalId = 6, Avatar = "anhbs18.jpg" },
                new Doctor { DoctorId = 18, UserId = 19, FullName = "ThS BS. Trần Thị Thu Hằng", Phone = "0901 234 518", ExperienceYears = 10, Description = "Chuyên khoa Nội tiêu hoá ", SpecializationId = 11, HospitalId = 7, Avatar = "anhbs1.jpg" }
            );

            modelBuilder.Entity<Patient>().HasData(
                new Patient 
                { 
                    PatientId = 1, 
                    UserId = 20, 
                    FullName = "Lê Thị B", 
                    DateOfBirth = new DateTime(1995, 5, 20), 
                    Gender = "Nữ", Phone = "0911223344", 
                    Address = "Phường Quy Nhơn Bắc, Gia Lai" 
                },
                new Patient 
                { 
                    PatientId = 2, 
                    UserId = 21, 
                    FullName = "Nguyễn Văn B", 
                    DateOfBirth = new DateTime(1990, 10, 20), 
                    Gender = "Nam", Phone = "0911223345", 
                    Address = "Phường Quy Nhơn Nam, Gia Lai" 
                }
            );

            modelBuilder.Entity<DoctorSchedule>().HasData(
                new DoctorSchedule 
                { 
                    ScheduleId = 1, 
                    DoctorId = 1, 
                    WorkDate = new DateTime(2026, 6, 1), 
                    StartTime = new TimeSpan(8, 0, 0), 
                    EndTime = new TimeSpan(12, 0, 0), 
                    MaxPatients = 10, 
                    CurrentPatients = 1 
                }
            );

            modelBuilder.Entity<Appointment>().HasData(
                new Appointment 
                { 
                    AppointmentId = 1, 
                    PatientId = 1, 
                    DoctorId = 1, 
                    ScheduleId = 1, 
                    AppointmentDate = new DateTime(2026, 5, 20, 9, 30, 0), 
                    Status = AppointmentStatus.Completed 
                }
            );

            modelBuilder.Entity<MedicalRecord>().HasData(
                new MedicalRecord 
                { 
                    RecordId = 1, 
                    AppointmentId = 1, 
                    Symptoms = "Ho, sốt nhẹ", 
                    Diagnosis = "Viêm họng cấp", 
                    Treatment = "Uống thuốc ấm", 
                    Prescription = "Paracetamol 500mg" 
                }
            );
        }
    }
}