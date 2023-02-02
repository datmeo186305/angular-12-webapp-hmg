import {Pipe, PipeTransform} from '@angular/core';

/*
 * Format price
 * Takes a string as a value.
 * Usage:
 *  value | formatPrice
 * Example:
 *  // value.price = 1000000
 *  {{ value.price | formatPrice  }}
 *  formats to: 1,000,000 đ
*/
@Pipe({
  name: 'formatPrice'
})
export class FormatPricePipe implements PipeTransform {
  vndText: string = "₫";
  constructor() {
  }

  transform(value: any, args: any[]): string {
    if (value === null) return 'N/A';
    let val = (value / 1).toFixed(0).replace(".", ",");
    return (
      val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " " + this.vndText
    );
  }
}
