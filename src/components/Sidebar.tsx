import React, { useState } from "react";
import type { ScheduleRow } from "../types/scheduletype";

interface SidebarProps {
  masterData: ScheduleRow[];
}

export const Sidebar: React.FC<SidebarProps> = ({ masterData }) => {
  // Biến trạng thái lưu trữ từ khóa người dùng gõ vào thanh tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  // Thuật toán lọc: Chỉ giữ lại các môn học có mã hoặc tên chứa từ khóa
  const filteredData = masterData.filter((row) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const maMH = String(row.MAMH || "").toLowerCase();
    const tenMH = String(row.TENMH || "").toLowerCase();

    return maMH.includes(searchLower) || tenMH.includes(searchLower);
  });

  return (
    <div className="w-1/4 bg-white rounded-lg shadow-md flex flex-col h-full border border-gray-200">
      {/* KHU VỰC 1: Tiêu đề và Thanh tìm kiếm */}
      <div className="p-4 border-b border-gray-100 shrink-0">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          Danh sách lớp học
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Nhập mã môn (VD: IT001)..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Icon kính lúp */}
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* KHU VỰC 2: Danh sách kết quả */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {filteredData.length > 0 ? (
          filteredData.map((row, index) => (
            <div
              key={index}
              draggable
              className="p-3 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md hover:border-blue-400 cursor-grab active:cursor-grabbing transition-all group"
            >
              <div className="font-bold text-blue-700 group-hover:text-blue-800">
                {row.MAMH} - {row.MALOP}
              </div>
              <div
                className="text-sm text-gray-600 line-clamp-1 mt-1"
                title={row.TENMH}
              >
                {row.TENMH}
              </div>

              <div className="text-xs text-gray-500 mt-2 flex flex-col gap-1 bg-gray-100 p-1.5 rounded">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {row.THU
                      ? `Thứ ${row.THU} | Tiết ${row.TIET}`
                      : "Chưa xếp lịch"}
                  </span>
                  <span>Phòng: {row.PHONGHOC || "N/A"}</span>
                </div>
                <span className="italic text-gray-400">
                  GV: {row.TENGV || "Chưa phân công"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mt-10 flex flex-col items-center">
            <svg
              className="w-12 h-12 mb-2 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>Không tìm thấy lớp học nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};
