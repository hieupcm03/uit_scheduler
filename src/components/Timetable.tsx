import React, { useRef } from "react";
import { toPng } from "html-to-image";
import type { ScheduleRow } from "../types/scheduletype";

interface TimetableProps {
  mySchedule: ScheduleRow[];
  onRemoveCourse: (malop: string) => void;
}

const colorThemes = [
  "bg-blue-50 text-blue-900 border-blue-500",
  "bg-indigo-50 text-indigo-900 border-indigo-500",
  "bg-violet-50 text-violet-900 border-violet-500",
  "bg-fuchsia-50 text-fuchsia-900 border-fuchsia-500",
  "bg-emerald-50 text-emerald-900 border-emerald-500",
  "bg-teal-50 text-teal-900 border-teal-500",
  "bg-amber-50 text-amber-900 border-amber-500",
];

const getColorTheme = (maLop: string) => {
  let hash = 0;
  for (let i = 0; i < maLop.length; i++) {
    hash = maLop.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorThemes[Math.abs(hash) % colorThemes.length];
};

export const Timetable: React.FC<TimetableProps> = ({
  mySchedule,
  onRemoveCourse,
}) => {
  const days = [2, 3, 4, 5, 6, 7];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const timetableRef = useRef<HTMLDivElement>(null); // Khai báo ref tham chiếu tới cái bảng TKB cần chụp

  const totalCredits = mySchedule.reduce(
    (sum, row) => sum + (row.SOTC || 0),
    0,
  );

  const badgeColor =
    totalCredits >= 12 && totalCredits <= 24
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  // 1. CHIA ĐỂ TRỊ: Phân loại môn học
  const normalCourses = mySchedule.filter(
    (c) => c.THU && String(c.THU).trim() !== "",
  );
  const specialCourses = mySchedule.filter(
    (c) => !c.THU || String(c.THU).trim() === "",
  );

  // 2. Xử lý môn học bình thường để vẽ lên sa bàn
  const expandedSchedule = normalCourses.flatMap((course) => {
    const arrThu = String(course.THU)
      .split(",")
      .map((item) => item.trim());
    const arrTiet = String(course.TIET)
      .split(",")
      .map((item) => item.trim());
    const arrPhong = String(course.PHONGHOC || "")
      .split(",")
      .map((item) => item.trim());

    return arrThu.map((thu, index) => {
      return {
        ...course,
        thuSingle: parseInt(thu, 10),
        tietSingle: arrTiet[index] || arrTiet[0],
        phongSingle: arrPhong[index] || arrPhong[0],
      };
    });
  });

  // 4. Hàm xử lý chụp ảnh và tải file về
  const handleExportImage = () => {
    const node = timetableRef.current;
    if (node === null) return;

    toPng(node, {
      cacheBust: true,
      backgroundColor: "#f9fafb",
      width: node.scrollWidth,
      height: node.scrollHeight,
      style: {
        overflow: "visible", // chỉ tắt thanh cuộn trên clone node, không ảnh hưởng đến thẻ div thật
      },
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "Thoi_Khoa_Bieu_UIT.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Lỗi khi xuất ảnh: ", err);
      });
  };

  return (
    <div className="w-3/4 bg-white rounded-lg shadow-md p-4 flex flex-col h-full border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="text-lg font-bold text-gray-800">
          Lịch học dự kiến của tôi
        </h2>

        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full shadow-sm transition-colors ${badgeColor}`}
          >
            Số TC: {totalCredits}
          </span>
          {/* Nút bấm tải ảnh */}
          <button
            onClick={handleExportImage}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Tải Ảnh
          </button>
        </div>
      </div>

      {/* Khu vực chứa lưới TKB và danh sách môn đặc biệt */}
      <div className="flex-1 overflow-auto flex flex-col gap-4">
        {/* LƯỚI THỜI KHÓA BIỂU CHÍNH */}
        <div
          ref={timetableRef}
          className="bg-gray-50 rounded-lg p-2 border border-gray-200 overflow-auto"
        >
          <div className="min-w-[900px] grid grid-cols-7 grid-rows-[auto_repeat(10,_minmax(90px,_auto))] gap-px bg-gray-200 border border-gray-200 rounded-sm">
            <div className="bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm p-2 rounded-tl-sm">
              Tiết \ Thứ
            </div>

            {days.map((day) => (
              <div
                key={`header-day-${day}`}
                className="bg-blue-50 text-blue-800 font-bold flex items-center justify-center py-3"
              >
                Thứ {day}
              </div>
            ))}

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

            {/* VẼ CÁC MÔN BÌNH THƯỜNG */}
            {expandedSchedule.map((session) => {
              if (!session.thuSingle || !session.tietSingle) return null;

              const tietStr = String(session.tietSingle);
              const startPeriod = tietStr.startsWith("10")
                ? 10
                : parseInt(tietStr[0], 10);
              const spanLength = tietStr.replace("10", "X").length;
              const themeClass = getColorTheme(
                String(session.MALOP || session.MAMH),
              );
              const currentMaLop = String(session.MALOP || session.MAMH);

              return (
                <div
                  key={`course-${currentMaLop}-${session.thuSingle}-${session.tietSingle}`}
                  style={{
                    gridColumn: session.thuSingle,
                    gridRow: `${startPeriod + 1} / span ${spanLength}`,
                  }}
                  className={`${themeClass} border-l-4 rounded-md p-2 flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all z-10 group relative h-full`}
                >
                  <button
                    onClick={() => onRemoveCourse(currentMaLop)}
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
                  <div className="text-xs font-semibold opacity-70 mb-1">
                    {session.MALOP || session.MAMH}
                  </div>
                  <div className="font-bold text-sm leading-snug mb-3 px-1">
                    {session.TENMH}
                  </div>
                  <div className="text-xs opacity-90 flex flex-col items-center gap-1.5 mt-3">
                    <div className="flex items-center gap-1.5">
                      <span>Tiết {session.tietSingle}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>{session.phongSingle || "Chưa có phòng"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KHU VỰC CÁC MÔN ĐẶC BIỆT (HT2, Đồ án) */}
        {specialCourses.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shrink-0">
            <h3 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">
              Môn học không có lịch cố định (Đồ án, HT2, Thực tập...)
            </h3>
            <div className="flex flex-wrap gap-3">
              {specialCourses.map((course) => {
                const themeClass = getColorTheme(
                  String(course.MALOP || course.MAMH),
                );
                const currentMaLop = String(course.MALOP || course.MAMH);
                return (
                  <div
                    key={`special-${currentMaLop}`}
                    className={`${themeClass} border-l-4 rounded-md p-3 relative group pr-8 flex-1 min-w-[200px] max-w-[300px] shadow-sm`}
                  >
                    <button
                      onClick={() => onRemoveCourse(currentMaLop)}
                      className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
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
                    <div className="text-xs font-semibold opacity-70 mb-1">
                      {course.MALOP || course.MAMH}
                    </div>
                    <div className="font-bold text-sm">{course.TENMH}</div>
                    <div className="text-xs mt-2 opacity-80 flex gap-3">
                      <span>TC: {course.SOTC}</span>
                      <span>{course.TENGV ? `GV: ${course.TENGV}` : ""}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
