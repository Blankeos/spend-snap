/**
 * Checks if not undefined and not null.
 * Primarily used for numeric values in this case:
 * - 0 (usually falsey) - True
 * - undefined - False
 * - null - False
 *
 * This also already knows how to type-narrow your value thanks to
 * TypeScript Generics.
 */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}
