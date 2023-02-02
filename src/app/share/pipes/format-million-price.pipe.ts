import { Pipe, PipeTransform } from '@angular/core';

/*
 * Format million price
 * Takes a string as a value.
 * Usage:
 *  value | formatMillionPrice
 * Example:
 *  // value.price = 1000000
 *  {{ value.price | formatMillionPrice  }}
 *  formats to: 1 Tr
 */

@Pipe({
  name: 'formatMillionPrice',
})
export class FormatMillionPricePipe implements PipeTransform {
  millionText: string = 'Triệu';

  transform(value: any, ...args: any[]): string {
    if (!value) return '';
    let fractionDigits = (value / 1000000) % 1 !== 0 ? 1 : 0;
    let val = (value / 1000000).toFixed(fractionDigits).replace('.', ',');
    return (
      val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') +
      ' ' +
      this.millionText
    );
  }
}
