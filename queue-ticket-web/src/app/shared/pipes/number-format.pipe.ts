import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true
})
export class NumberFormatPipe implements PipeTransform {
  /**
   * แปลงตัวเลขให้มี comma และกำหนดทศนิยมได้
   * @param value ตัวเลขที่ต้องการแปลง
   * @param decimals จำนวนทศนิยม (ค่าเริ่มต้นคือ 0)
   * @returns string ที่ฟอร์แมตแล้ว (เช่น 1,000.00)
   */
  transform(value: number | string | null | undefined, decimals: number = 0): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) {
      return '';
    }

    return num.toLocaleString('th-TH', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }
}
