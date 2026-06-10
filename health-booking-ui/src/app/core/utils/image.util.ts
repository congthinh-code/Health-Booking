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
  if (!avatar) {
    return '/assets/images/doctor.png';
  }
  return encodeURI(`/assets/images/anhbacsi/${avatar}`);
}

export const FALLBACK_LOGO = '/assets/images/logo.png';
export const FALLBACK_DOCTOR = '/assets/images/doctor.png';
