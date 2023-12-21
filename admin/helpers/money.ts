import { Decimal } from "@keystone-6/core/types";
import Dinero from "dinero.js";

import { GST_MULTIPLIER } from "../../src/lib/variables";

type Money = Dinero.Dinero;
Dinero.defaultAmount = 0;
Dinero.defaultCurrency = "AUD";

// Conversions

export function dollarsToCents(dollars: number) {
  return Math.round(dollars * 100);
}

export function centsToDollars(cents: number) {
  return (cents / 100).toFixed(2);
}

export function floatToDinero(float: number) {
  return Dinero({ amount: dollarsToCents(float) });
}

export function decimalToDinero(d: Decimal) {
  return floatToDinero(d.toNumber());
}

// Calculations

export const Calc = {
  price(unitPrice: Money, qty: number) {
    return unitPrice.multiply(qty);
  },
  gst(price: Money, multiplier: number = GST_MULTIPLIER) {
    return price.multiply(multiplier);
  },
  uTotal(unitPrice: Money, qty: number, multiplier: number = GST_MULTIPLIER) {
    return unitPrice.multiply(qty).multiply(1 + multiplier);
  },
  total(price: Money, multiplier: number = GST_MULTIPLIER) {
    return price.multiply(1 + multiplier);
  },
  sum(n: { [field: string]: number }[], field: string) {
    return n.reduce(
      (acc, cur) => acc.add(Dinero({ amount: dollarsToCents(cur[field]) })),
      Dinero({})
    );
  },
};
