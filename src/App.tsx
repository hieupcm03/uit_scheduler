import { useState } from "react";
import { FileUploader } from "./components/FileUploader";
import { Sidebar } from "./components/Sidebar";
import { Timetable } from "./components/Timetable";
import type { ScheduleRow } from "./types/scheduletype";

function App() {
  const [masterData, setMasterData] = useState<ScheduleRow[]>([]);
  const [mySchedule, setMySchedule] = useState<ScheduleRow[]>([]);

  // Hàm xử lý khi người dùng thêm một môn học vào lịch của họ
  const handleAddCourse = (course: ScheduleRow) => {
    // Kiểm tra xem môn học đã tồn tại trong lịch chưa
    const isAlreadyAdded = mySchedule.some(
      (c) => c.MAMH === course.MAMH && c.MALOP === course.MALOP,
    );
    if (isAlreadyAdded) {
      console.warn("Môn học này đã được thêm vào lịch của bạn.");
      return;
    }
    setMySchedule((prevSchedule) => [...prevSchedule, course]);
  };

  // Hàm xử lý xóa môn học
  const handleRemoveCourse = (rmCourse: string) => {
    const newSchedule = mySchedule.filter((course) => course.MAMH !== rmCourse);
    setMySchedule(newSchedule);
  };

  console.log("Dữ liệu môn học:", mySchedule);
  return (
    <div className="h-screen bg-gray-100 font-sans flex flex-col">
      <header className="bg-white shadow-sm px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="/logo-uit.webp"
            alt="UIT Logo"
            className="w-9 h-9 object-contain"
          />
          <h1 className="text-2xl font-bold text-blue-800">UIT Scheduler</h1>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-hidden">
        {masterData.length === 0 ? (
          <FileUploader onDataLoaded={setMasterData} />
        ) : (
          <div className="flex gap-6 h-full">
            <Sidebar masterData={masterData} onAddCourse={handleAddCourse} />
            <Timetable
              mySchedule={mySchedule}
              onRemoveCourse={handleRemoveCourse}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
