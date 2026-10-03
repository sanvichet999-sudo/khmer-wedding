// Helper to convert standard Arabic digits into Khmer numerals (០-៩)

const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

export function toKhmerNumber(num: number | string): string {
  const str = String(num);
  return str.replace(/[0-9]/g, (match) => KHMER_DIGITS[parseInt(match, 10)]);
}
