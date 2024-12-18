export const numberFormatter = new Intl.NumberFormat('en');

export function NumberFormat({ value }) {
  return numberFormatter.format(value);
}
