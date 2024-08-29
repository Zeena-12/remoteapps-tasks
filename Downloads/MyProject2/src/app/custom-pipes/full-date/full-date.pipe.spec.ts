import { FullDatePipe } from './full-date.pipe';

describe('DateFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new FullDatePipe();
    expect(pipe).toBeTruthy();
  });
});
