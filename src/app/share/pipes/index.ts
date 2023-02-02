import { CapitalizeFirstPipe } from './capitalize-first.pipe';
import { FormatPricePipe } from './format-price.pipe';
import { FormatDateAndTimePipe } from './format-date-and-time.pipe';
import { FormatMillionPricePipe } from './format-million-price.pipe';

export const pipes: any[] = [
  CapitalizeFirstPipe,
  FormatPricePipe,
  FormatDateAndTimePipe,
  FormatMillionPricePipe,
];

export * from './capitalize-first.pipe';
export * from './format-price.pipe';
export * from './format-date-and-time.pipe';
export * from './format-million-price.pipe';
