/** Ánh xạ tên chuyên khoa trong DB → tên file icon thực tế trên disk */
const SPECIALTY_ICON_FILES: Record<string, string> = {
  'Sản - Phụ khoa': 'Sản - phụ khoa',
  'Nội tiêu hóa': 'Nội tiêu hoá',
};

export function specialtyIconPath(name: string): string {
  const fileName = SPECIALTY_ICON_FILES[name.trim()] ?? name.trim();
  return encodeURI(`/assets/images/iconchuyenkhoa/${fileName}.png`);
}

export function hospitalImagePath(image?: string | null): string {
  if (!image) {
    return '/assets/images/logo.png';
  }
  const path = image.startsWith('images/')
    ? `/assets/${image}`
    : `/assets/images/anhbenhvien/${image}`;
  return encodeURI(path);
}

export function doctorAvatarPath(avatar?: string | null): string {
  // Không có avatar → ảnh mặc định
  if (!avatar || avatar === 'null' || avatar === 'undefined' || avatar.trim() === '') {
    return '/assets/images/doctor.png';
  }
  // Đã là link đầy đủ (http/https) hoặc assets/ → dùng ngay
  if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('assets/') || avatar.startsWith('/assets/')) {
    return avatar;
  }
  // Đường dẫn /uploads/... do backend C# lưu → ghép với https://localhost:7291
  if (avatar.startsWith('/uploads')) {
    return `https://localhost:7291${avatar}`;
  }
  // Tên file tĩnh (ví dụ: anhbs1.jpg) → trỏ vào thư mục anhbacsi
  return encodeURI(`/assets/images/anhbacsi/${avatar}`);
}

export const FALLBACK_LOGO = '/assets/images/logo.png';
export const FALLBACK_DOCTOR = '/assets/images/doctor.png';
