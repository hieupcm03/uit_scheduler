export interface ScheduleRow {
  STT: number;
  MAMH: string;
  MALOP: string;
  TENMH: string;
  MAGV?: string;
  TENGV?: string;
  SISO?: string;
  SOTC?: number;
  THUCHANH?: number;
  HTGD?: string; // Hình thức giảng dạy (LT, TH, HT1...)
  THU?: number | string; // Có thể trống với khóa luận
  TIET?: string | number; // Chuỗi tiết học VD: "123", "678"
  PHONGHOC?: string;
  KHOAHOC?: string | number;
  HEDT?: string;
  MA_LOP_LT?: string; // Dành cho lớp thực hành trỏ về lớp lý thuyết
}
