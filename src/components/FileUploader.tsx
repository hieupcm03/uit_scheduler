import React from "react";
import { parseExcelToJSON } from "../utils/excelHelper";
import type { ScheduleRow } from "../types/scheduletype";

interface FileUploaderProps {
  onDataLoaded: (data: ScheduleRow[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded }) => {
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseExcelToJSON<ScheduleRow>(file);
      onDataLoaded(data);
    } catch (error) {
      console.error("Lỗi parse dữ liệu:", error);
      alert("Không thể đọc file. Vui lòng kiểm tra lại định dạng file Excel.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-10 h-10 mb-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Nhấn để tải lên</span>{" "}
            hoặc kéo thả file vào đây
          </p>
          <p className="text-xs text-gray-500">
            Chỉ chấp nhận file định dạng Excel (.xlsx, .xls)
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
};
