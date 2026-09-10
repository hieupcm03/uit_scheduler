import { useState } from "react";
import { FileUploader } from "./components/FileUploader";
import { Sidebar } from "./components/Sidebar";
import { Timetable } from "./components/Timetable";
import { AlertModal } from "./components/AlertModal"; // Import Modal mới
import type { ScheduleRow } from "./types/scheduletype";

const getOccupiedSlots = (course: ScheduleRow): string[] => {
  if (!course.THU || !course.TIET) return [];

  const arrThu = String(course.THU)
    .split(",")
    .map((t) => t.trim());
  const arrTiet = String(course.TIET)
    .split(",")
    .map((t) => t.trim());
  const slots: string[] = [];

  arrThu.forEach((thu, index) => {
    if (!thu) return;
    const tietStr = arrTiet[index] || arrTiet[0];
    if (!tietStr) return;

    const startPeriod = tietStr.startsWith("10")
      ? 10
      : parseInt(tietStr[0], 10);
    const spanLength = tietStr.replace("10", "X").length;

    for (let i = 0; i < spanLength; i++) {
      slots.push(`T${thu}-P${startPeriod + i}`);
    }
  });
  return slots;
};

function App() {
  const [masterData, setMasterData] = useState<ScheduleRow[]>([]);
  const [mySchedule, setMySchedule] = useState<ScheduleRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleAddCourse = (newCourse: ScheduleRow) => {
    const sameSubjectCourses = mySchedule.filter(
      (c) => c.MAMH === newCourse.MAMH,
    );

    if (sameSubjectCourses.length > 0) {
      const isExactSame = sameSubjectCourses.some(
        (c) => c.MALOP === newCourse.MALOP,
      );
      if (isExactSame) {
        setErrorMessage("Lớp này đã được thêm vào lịch của bạn rồi!");
        return;
      }

      const isValidPair = sameSubjectCourses.some((c) => {
        const currentMaLop = String(c.MALOP || "");
        const newMaLop = String(newCourse.MALOP || "");
        return (
          newMaLop.startsWith(currentMaLop) || currentMaLop.startsWith(newMaLop)
        );
      });

      if (!isValidPair) {
        setErrorMessage(
          `Bạn đang cố đăng ký lớp [${newCourse.MALOP}], nhưng đã có lớp khác của môn ${newCourse.TENMH} trong lịch.\n\n Lưu ý: Lớp Thực hành và Lý thuyết phải cùng chung mã gốc!`,
        );
        return;
      }
    }

    const newCourseSlots = getOccupiedSlots(newCourse);
    const currentScheduleSlots = mySchedule.flatMap((c) => getOccupiedSlots(c));

    const conflictSlots = newCourseSlots.filter((slot) =>
      currentScheduleSlots.includes(slot),
    );

    if (conflictSlots.length > 0) {
      setErrorMessage(
        `Trùng lịch học!\n\nLớp [${newCourse.MALOP}] bị cấn giờ với một môn khác đang có trên lịch của bạn.`,
      );
      return;
    }

    setMySchedule((prevSchedule) => [...prevSchedule, newCourse]);
  };

  // Hàm xử lý xóa môn học
  const handleRemoveCourse = (rmLOP: string) => {
    const newSchedule = mySchedule.filter((course) => {
      const currentMaLop = String(course.MALOP || "");

      // Điều kiện 1: Trùng với mã lớp cần xóa
      const isExactMatch = currentMaLop === rmLOP;

      // Điều kiện 2: Là lớp Thực hành của lớp cần xóa
      const isPracticalClass = currentMaLop.startsWith(rmLOP + ".");
      return !(isExactMatch || isPracticalClass);
    });
    setMySchedule(newSchedule);
  };

  return (
    <div className="h-screen bg-gray-100 font-sans flex flex-col relative">
      {/* AlertModal chỉ hiện khi errorMessage có chữ */}
      {errorMessage && (
        <AlertModal
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}

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
