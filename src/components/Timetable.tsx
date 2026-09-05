import React from "react";
import type { ScheduleRow } from "../types/scheduletype";

interface TimetableProps {
  mySchedule: ScheduleRow[];
}

export const Timetable: React.FC<TimetableProps> = ({ mySchedule }) => {
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
    totalCredits >= 12
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

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
        <div className="min-w-[800px] h-full grid grid-cols-7 grid-rows-[auto_repeat(10,_1fr)] gap-1 bg-gray-200 border border-gray-200 rounded-sm">
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
              {/* Cột tiêu đề tiết */}
              <div className="bg-gray-100 font-bold text-gray-600 flex items-center justify-center text-sm">
                Tiết {period}
              </div>

              {/* 6 ô trống */}
              {days.map((day) => (
                <div
                  key={`cell-day${day}-period${period}`}
                  className="bg-white relative hover:bg-blue-50 transition-colors border border-dashed border-transparent hover:border-blue-300"
                ></div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
