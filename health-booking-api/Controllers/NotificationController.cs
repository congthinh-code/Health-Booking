using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using health_booking_api.Models;

namespace health_booking_api.Controllers
{
    [ApiController]
    // 🔥 ĐÃ SỬA: Bỏ dấu ngoặc vuông bọc chữ Notification để sửa lỗi sập hệ thống (Crash)
    [Route("api/Notification")]
    public class NotificationController : ControllerBase
    {
        private readonly HealthBookingDbContext _context;

        public NotificationController(HealthBookingDbContext context)
        {
            _context = context;
        }

        // 🟢 API LẤY THÔNG BÁO (Bỏ chữ api/[Notification] ở đây vì đã có ở Route tổng phía trên)
        [HttpGet("get-notifications/{userId}")]
        public async Task<IActionResult> GetNotifications(int userId)
        {
            var oneDayAgo = DateTime.Now.AddDays(-1);

            var notifications = await _context.Notifications
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .Take(20)
                .Select(x => new
                {
                    notifyId = x.NotificationId,
                    message = x.Message,
                    createdAt = x.CreatedAt.ToString("HH:mm dd/MM/yyyy"),
                    isNew = x.CreatedAt >= oneDayAgo ? 1 : 0
                })
                .ToListAsync();

            int unreadCount = await _context.Notifications
                .CountAsync(x => x.UserId == userId && x.CreatedAt >= oneDayAgo);

            return Ok(new
            {
                success = true,
                notifications = notifications,
                unreadCount = unreadCount
            });
        }

        // 🟢 API XÓA THÔNG BÁO
        [HttpDelete("delete/{notifyId}/{userId}")]
        public async Task<IActionResult> DeleteNotification(int notifyId, int userId)
        {
            var noti = await _context.Notifications
                .FirstOrDefaultAsync(x => x.NotificationId == notifyId && x.UserId == userId);

            if (noti == null) return NotFound(new { success = false });

            _context.Notifications.Remove(noti);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
    }
}