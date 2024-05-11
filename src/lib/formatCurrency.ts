import { format } from "numerable";

export function formatCurrency(amount: number, currency: "PHP" = "PHP") {
  return currency + " " + format(amount, "0,0.00");
}
