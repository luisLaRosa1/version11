import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeDecimalMoneyFormat',
})
export class PipeDecimalMoneyFormat implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (parts.length > 1) {
      parts[1] = parts[1].substring(0, 2);
    }

    return parts.join('.');
  }
}
