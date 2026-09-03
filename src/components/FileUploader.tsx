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
    <div style={{ marginTop: "20px" }}>
      <label style={{ marginRight: "10px", fontWeight: "bold" }}>
        Chọn file thời khóa biểu (Excel):
      </label>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    </div>
  );
};
