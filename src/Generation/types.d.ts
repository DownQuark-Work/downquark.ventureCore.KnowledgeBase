
// interface Number {
//   toString(radix?: number): string;
//   toFixed(fractionDigits?: number): string;
//   toExponential(fractionDigits?: number): string;
//   toPrecision(precision?: number): string;
//   valueOf(): number;
//   clamp(_:number, __:number, ___:number): number
// }
// interface NumberClamp extends Number {
//   clamp(_:number, __:number, ___:number): number
// }
interface Math {
  clamp(_:number, __:number, ___:number): number
} 