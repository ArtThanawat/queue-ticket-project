/**
 * แปลง Date หรือ String เป็น ISO String (YYYY-MM-DDTHH:mm:ss.sssZ)
 */
export function toISODate(date: Date | string | number): string {
  if (!date) return '';
  return new Date(date).toISOString();
}

/**
 * แปลง Date เป็นรูปแบบ YYYY-MM-DD สำหรับส่งให้ API
 */
export function toDateString(date: Date | string | number): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

/**
 * เช็คว่าวันที่สองตัวคือวันเดียวกันหรือไม่ (ไม่สนเวลา)
 */
export function isSameDay(date1: Date | string | number, date2: Date | string | number): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
