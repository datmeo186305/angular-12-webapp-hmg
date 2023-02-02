import { FormatMillionPricePipe } from './format-million-price.pipe';

describe('FormatMillionPricePipe', () => {
  it('create an instance', () => {
    const pipe = new FormatMillionPricePipe();
    expect(pipe).toBeTruthy();
  });
});
