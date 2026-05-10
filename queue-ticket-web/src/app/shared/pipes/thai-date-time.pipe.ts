import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaiDateTime',
  standalone: true
})
export class ThaiDateTimePipe implements PipeTransform {
  private readonly datePipe = new DatePipe('th-TH');

  transform(value: Date | string | number | null | undefined): string {
    if (!value) {
      return '-';
    }

    return this.datePipe.transform(value, 'd/M/yyyy เวลา HH:mm น.') ?? '-';
  }
}
