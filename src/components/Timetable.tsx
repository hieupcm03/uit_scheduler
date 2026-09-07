import React from "react";
import type { ScheduleRow } from "../types/scheduletype";

interface TimetableProps {
  mySchedule: ScheduleRow[];
  onRemoveCourse: (mamh: string) => void;
}

export const Timetable: React.FC<TimetableProps> = ({
  mySchedule,
  onRemoveCourse,
}) => {
  // Định nghĩa trục X (Cột) và trục Y (Hàng) của ma trận
  const days = [2, 3, 4, 5, 6, 7];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Tính tổng số tín chỉ từ các môn đã xếp vào lịch
  const totalCredits = mySchedule.reduce(
    (sum, row) => sum + (row.SOTC || 0),
    0,
  );

  // Logic kiểm tra: Đạt mốc 12 tín chỉ thì xanh an toàn, dưới 12 thì đỏ cảnh báo
  const badgeColor =
    totalCredits >= 12 && totalCredits <= 24
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  // Bảng màu pastel
  const colorThemes = [
    "bg-blue-50 text-blue-900 border-blue-500",
    "bg-indigo-50 text-indigo-900 border-indigo-500",
    "bg-violet-50 text-violet-900 border-violet-500",
    "bg-fuchsia-50 text-fuchsia-900 border-fuchsia-500",
    "bg-emerald-50 text-emerald-900 border-emerald-500",
    "bg-teal-50 text-teal-900 border-teal-500",
    "bg-amber-50 text-amber-900 border-amber-500",
  ];

  // Hàm tự động chọn màu dựa vào Mã Lớp
  const getColorTheme = (maLop: string) => {
    let hash = 0;
    for (let i = 0; i < maLop.length; i++) {
      hash = maLop.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colorThemes[Math.abs(hash) % colorThemes.length];
  };

  return (
    <div className="w-3/4 bg-white rounded-lg shadow-md p-4 flex flex-col h-full border border-gray-200">
      {/* Header khu vực TKB */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="text-lg font-bold text-gray-800">
          Lịch học dự kiến của tôi
        </h2>
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full shadow-sm transition-colors ${badgeColor}`}
        >
          Số TC: {totalCredits}
        </span>
      </div>

      {/* Khu vực lưới TKB ( có thanh cuộn nếu màn hình nhỏ ) */}
      <div className="flex-1 overflow-auto bg-gray-50 rounded-lg p-2 border border-gray-200">
        {/* Ma trận CSS Grid: 7 cột x 11 hàng */}
        <div className="min-w-[900px] grid grid-cols-7 grid-rows-[auto_repeat(10,_minmax(90px,_auto))] gap-px bg-gray-200 border border-gray-200 rounded-sm">
          {/* Ô góc trên cùng bên trái (Tiết \ thứ) */}
          <div className="bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm p-2 rounded-tl-sm">
            Tiết \ Thứ
          </div>

          {/* Vẽ hàng thứ: Thứ 2 -> Thứ 7 */}
          {days.map((day) => (
            <div
              key={`header-day-${day}`}
              className="bg-blue-50 text-blue-800 font-bold flex items-center justify-center py-3"
            >
              Thứ {day}
            </div>
          ))}

          {/* Vẽ các hàng tiết học và các ô trống */}
          {periods.map((period) => (
            <React.Fragment key={`row-${period}`}>
              <div
                className="bg-gray-100 font-bold text-gray-600 flex items-center justify-center text-sm"
                style={{ gridColumn: 1, gridRow: period + 1 }}
              >
                Tiết {period}
              </div>

              {days.map((day) => (
                <div
                  key={`cell-day${day}-period${period}`}
                  className="bg-white relative hover:bg-blue-50 transition-colors border border-dashed border-transparent hover:border-blue-300"
                  style={{ gridColumn: day, gridRow: period + 1 }}
                ></div>
              ))}
            </React.Fragment>
          ))}

          {/* VẼ CÁC MÔN HỌC ĐÃ ĐĂNG KÝ LÊN SA BÀN */}
          {mySchedule.map((course, index) => {
            if (!course.THU || !course.TIET) return null;

            const tietStr = String(course.TIET);
            const startPeriod = tietStr.startsWith("10")
              ? 10
              : parseInt(tietStr[0], 10);
            const spanLength = tietStr.replace("10", "X").length;

            const themeClass = getColorTheme(
              String(course.MALOP || course.MAMH),
            );

            return (
              <div
                key={`course-${index}`}
                style={{
                  gridColumn: course.THU,
                  gridRow: `${startPeriod + 1} / span ${spanLength}`,
                }}
                className={`${themeClass} border-l-4 rounded-md p-2 flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all z-10 group relative h-full`}
              >
                {/* Nút xóa */}
                <button
                  onClick={() => onRemoveCourse(course.MAMH)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-20 shadow-sm cursor-pointer"
                  title="Xóa môn học này"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                {/* Mã Lớp */}
                <div className="text-xs font-semibold opacity-70 mb-1">
                  {course.MALOP || course.MAMH}
                </div>

                {/* Tên Môn Học */}
                <div className="font-bold text-sm leading-snug mb-3 px-1">
                  {course.TENMH}
                </div>

                {/* Thông tin Tiết & Phòng */}
                <div className="text-xs opacity-90 flex flex-col items-center gap-1.5 mt-3">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Tiết {course.TIET}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{course.PHONGHOC || "Chưa có phòng"}</span>
                  </div>
                </div>

                {/* Tên Giảng Viên */}
                <div className="text-xs font-medium mt-3 pt-2 border-t border-current/10 w-full">
                  {course.TENGV || "Chưa phân công"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
