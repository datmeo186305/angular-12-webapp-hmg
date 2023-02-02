import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/*
 * Format date and time
 * Takes a string as a value.
 * Usage:
 *  value | formatDateAndTime
 * Example:
 *  // value.createdAt = 2021/09/02 12:30:00
 *  {{ value.createdAt | formatDateAndTime  }}
 *  formats to: 02/09/2021 12:30:00'
*/

@Pipe({
  name: 'formatDateAndTime',
})
export class FormatDateAndTimePipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    return value
      ? moment(new Date(value)).format(
          'DD/MM/YYYY HH:mm:ss'
        )
      : null;
  }
}
