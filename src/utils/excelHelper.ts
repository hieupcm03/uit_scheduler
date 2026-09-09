import * as XLSX from "xlsx";

export const parseExcelToJSON = <T>(file: File): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result; // Lấy dữ liệu từ FileReader
        const workbook = XLSX.read(data, { type: "array" }); // type: array là tham số cho XLSX biết kiểu của data để dùng đúng bộ giải mã.
        const firstSheetName = workbook.SheetNames[0]; // SheetNames là mảng chứa tên các Sheet
        const worksheet = workbook.Sheets[firstSheetName]; //Sheets là object dạng <key, value> chứa dữ liệu của các Sheet
        // Đọc file thành mảng 2 chiều
        const rawData = XLSX.utils.sheet_to_json<any[]>(worksheet, {
          header: 1,
        }); // header: 1 có tác dụng tắt chế độ đoán tiêu đề, mặc định 1 dòng là 1 mảng con
        // Xác định vị trí chính xác của header
        const headerRowIndex = rawData.findIndex((row) =>
          row.some(
            (cell) =>
              typeof cell === "string" &&
              (cell.trim() === "MAMH" || cell.trim() === "MALOP"),
          ),
        );
        if (headerRowIndex === -1) {
          throw new Error("Khong tim thay cau truc du lieu chuan.");
        }
        const jsonData = XLSX.utils.sheet_to_json<T>(worksheet, {
          range: headerRowIndex,
        }); // Biến sheet thành JSON
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file); // Đọc file Excel dưới dạng ArrayBuffer
  });
};
