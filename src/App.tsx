import { useState } from "react";
import { FileUploader } from "./components/FileUploader";
import type { ScheduleRow } from "./types/scheduletype";

function App() {
  const [scheduleData, setScheduleData] = useState<ScheduleRow[]>([]);

  const handleDataLoaded = (data: ScheduleRow[]) => {
    setScheduleData(data);
    console.log("Dữ liệu bóc tách thành công:", data);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>UIT Scheduler</h1>

      <FileUploader onDataLoaded={handleDataLoaded} />

      {scheduleData.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#e6ffe6",
            borderRadius: "8px",
          }}
        >
          <p>
            <strong>Thành công!</strong> Hệ thống đã nạp {scheduleData.length}{" "}
            lớp học.
          </p>
          <p style={{ fontSize: "14px", color: "#555" }}>
            * Nhấn F12 mở tab Console để xem cấu trúc mảng JSON.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
