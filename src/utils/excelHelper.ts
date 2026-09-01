import * as XLSX from "xlsx";

export const parseExcelToJSON = <T>(file: File): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result; // Lấy dữ liệu từ FileReader
        const workbook = XLSX.read(data, { type: "array" }); // type: array la tham so giup SheetJS doc file Excel tu ArrayBuffer
        const firstSheetName = workbook.SheetNames[0]; // SheetNames là mảng chứa tên các Sheet
        const worksheet = workbook.Sheets[firstSheetName]; //Sheets là object dạng <key, value> chứa dữ liệu của các Sheet
        const jsonData = XLSX.utils.sheet_to_json<T>(worksheet); // Biến sheet thành JSON
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file); // Đọc file Excel dưới dạng ArrayBuffer
  });
};
