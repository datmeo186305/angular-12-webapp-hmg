import { HiddenDirective } from './hidden.directive';
import { NumberOnlyDirective } from './number-only.directive';
import { PhoneNumberOnlyDirective } from './phone-number-only.directive';

export const directives: any[] = [
  HiddenDirective,
  NumberOnlyDirective,
  PhoneNumberOnlyDirective,
];

export * from './hidden.directive';
export * from './number-only.directive';
export * from './phone-number-only.directive';
