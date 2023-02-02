import { PhoneNumberOnlyDirective } from './phone-number-only.directive';

describe('PhoneNumberOnlyDirective', () => {
  it('should create an instance', () => {
    const directive = new PhoneNumberOnlyDirective(null, null);
    expect(directive).toBeTruthy();
  });
});
